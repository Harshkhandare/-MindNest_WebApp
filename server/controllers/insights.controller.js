const Mood = require('../models/Mood');
const Journal = require('../models/Journal');
const Goal = require('../models/Goal');
const { getPool } = require('../config/db');

// Get mood insights and patterns
exports.getMoodInsights = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const userId = req.user.id;
    const days = parseInt(req.query.days) || 30;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Get mood data
    const moods = await Mood.findByUser(userId, {
      startDate,
      endDate
    });

    if (moods.length === 0) {
      return res.json({
        insights: [],
        patterns: [],
        recommendations: ['Start tracking your mood daily to get personalized insights!']
      });
    }

    const insights = [];
    const patterns = [];

    // Calculate average mood
    const avgMood = moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length;
    
    // Mood trend (comparing first half vs second half)
    const midPoint = Math.floor(moods.length / 2);
    const firstHalf = moods.slice(0, midPoint);
    const secondHalf = moods.slice(midPoint);
    const firstHalfAvg = firstHalf.reduce((sum, m) => sum + m.moodLevel, 0) / firstHalf.length;
    const secondHalfAvg = secondHalf.reduce((sum, m) => sum + m.moodLevel, 0) / secondHalf.length;
    const trend = secondHalfAvg - firstHalfAvg;

    if (trend > 0.5) {
      insights.push({
        type: 'positive',
        message: `Your mood has improved by ${trend.toFixed(1)} points over the last ${days} days!`,
        icon: '📈'
      });
    } else if (trend < -0.5) {
      insights.push({
        type: 'warning',
        message: `Your mood has decreased by ${Math.abs(trend).toFixed(1)} points. Consider reaching out for support.`,
        icon: '📉'
      });
    }

    // Day of week pattern
    const dayOfWeekMoods = {};
    moods.forEach(mood => {
      const day = new Date(mood.date).getDay();
      const dayName = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][day];
      if (!dayOfWeekMoods[dayName]) {
        dayOfWeekMoods[dayName] = [];
      }
      dayOfWeekMoods[dayName].push(mood.moodLevel);
    });

    const dayAverages = Object.entries(dayOfWeekMoods).map(([day, levels]) => ({
      day,
      average: levels.reduce((a, b) => a + b, 0) / levels.length,
      count: levels.length
    }));

    if (dayAverages.length > 0) {
      const bestDay = dayAverages.reduce((a, b) => a.average > b.average ? a : b);
      const worstDay = dayAverages.reduce((a, b) => a.average < b.average ? a : b);
      
      if (bestDay.average - worstDay.average > 1) {
        patterns.push({
          type: 'day-pattern',
          message: `You tend to feel better on ${bestDay.day}s (avg ${bestDay.average.toFixed(1)}/10) and lower on ${worstDay.day}s (avg ${worstDay.average.toFixed(1)}/10)`,
          icon: '📅'
        });
      }
    }

    // Emotion frequency
    const emotionCounts = {};
    moods.forEach(mood => {
      emotionCounts[mood.emotion] = (emotionCounts[mood.emotion] || 0) + 1;
    });

    const mostCommonEmotion = Object.entries(emotionCounts).reduce((a, b) => 
      a[1] > b[1] ? a : b
    );

    if (mostCommonEmotion[1] > moods.length * 0.3) {
      patterns.push({
        type: 'emotion-pattern',
        message: `${mostCommonEmotion[0]} is your most common emotion (${Math.round(mostCommonEmotion[1] / moods.length * 100)}% of the time)`,
        icon: '😊'
      });
    }

    // Journal correlation
    const journals = await Journal.findByUser(userId, {
      search: null,
      page: 1,
      limit: 100
    });

    if (journals.length > 0) {
      const journalDates = new Set(journals.map(j => new Date(j.createdAt).toDateString()));
      const journalMoods = moods.filter(m => 
        journalDates.has(new Date(m.date).toDateString())
      );
      
      if (journalMoods.length > 0) {
        const journalMoodAvg = journalMoods.reduce((sum, m) => sum + m.moodLevel, 0) / journalMoods.length;
        const nonJournalMoods = moods.filter(m => !journalDates.has(new Date(m.date).toDateString()));
        const nonJournalMoodAvg = nonJournalMoods.length > 0
          ? nonJournalMoods.reduce((sum, m) => sum + m.moodLevel, 0) / nonJournalMoods.length
          : 0;
        
        if (journalMoodAvg > nonJournalMoodAvg + 0.5) {
          insights.push({
            type: 'correlation',
            message: `Your mood is ${(journalMoodAvg - nonJournalMoodAvg).toFixed(1)} points higher on days you journal!`,
            icon: '📝'
          });
        }
      }
    }

    // Generate recommendations
    const recommendations = [];
    if (avgMood < 5) {
      recommendations.push('Consider trying some coping strategies or reaching out for support');
    }
    if (moods.length < days * 0.7) {
      recommendations.push('Try to track your mood more consistently for better insights');
    }
    if (journals.length === 0) {
      recommendations.push('Start journaling to track your thoughts and feelings');
    }
    if (recommendations.length === 0) {
      recommendations.push('Keep up the great work tracking your mental health!');
    }

    res.json({
      insights,
      patterns,
      recommendations,
      stats: {
        averageMood: avgMood.toFixed(2),
        totalEntries: moods.length,
        trend: trend.toFixed(2),
        daysTracked: days
      }
    });
  } catch (error) {
    console.error('Get mood insights error:', error);
    res.status(500).json({ message: error.message });
  }
};

// Get weekly wellness report
exports.getWeeklyReport = async (req, res) => {
  try {
    const pool = getPool();
    if (!pool) {
      return res.status(503).json({ message: 'Database not connected' });
    }

    const userId = req.user.id;
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);

    // Get data
    const moods = await Mood.findByUser(userId, { startDate, endDate });
    const journals = await Journal.findByUser(userId, { page: 1, limit: 10 });
    const goals = await Goal.findByUser(userId, {});
    const activeGoals = goals.filter(g => g.status === 'in-progress' || g.status === 'pending');

    // Calculate stats
    const avgMood = moods.length > 0 
      ? (moods.reduce((sum, m) => sum + m.moodLevel, 0) / moods.length).toFixed(2)
      : null;
    
    const moodTrend = moods.length >= 2 
      ? (moods[0].moodLevel - moods[moods.length - 1].moodLevel).toFixed(1)
      : null;

    const journalCount = journals.filter(j => {
      const journalDate = new Date(j.createdAt);
      return journalDate >= startDate && journalDate <= endDate;
    }).length;

    const completedGoals = goals.filter(g => g.status === 'completed').length;
    const goalProgress = activeGoals.length > 0
      ? (activeGoals.reduce((sum, g) => sum + (g.progress || 0), 0) / activeGoals.length).toFixed(0)
      : 0;

    res.json({
      week: {
        start: startDate.toISOString(),
        end: endDate.toISOString()
      },
      mood: {
        average: avgMood,
        trend: moodTrend,
        entries: moods.length,
        bestDay: moods.length > 0 ? Math.max(...moods.map(m => m.moodLevel)) : null,
        worstDay: moods.length > 0 ? Math.min(...moods.map(m => m.moodLevel)) : null
      },
      journal: {
        entries: journalCount,
        total: journals.length
      },
      goals: {
        active: activeGoals.length,
        completed: completedGoals,
        averageProgress: goalProgress
      },
      summary: generateSummary(avgMood, moodTrend, journalCount, activeGoals.length)
    });
  } catch (error) {
    console.error('Get weekly report error:', error);
    res.status(500).json({ message: error.message });
  }
};

function generateSummary(avgMood, trend, journalCount, activeGoals) {
  const summaries = [];
  
  if (avgMood) {
    if (parseFloat(avgMood) >= 7) {
      summaries.push('You had a great week! Your average mood was high.');
    } else if (parseFloat(avgMood) >= 5) {
      summaries.push('You had a decent week with moderate mood levels.');
    } else {
      summaries.push('This week was challenging. Remember, it\'s okay to not be okay.');
    }
  }

  if (trend && parseFloat(trend) > 0) {
    summaries.push('Your mood improved over the week - that\'s progress!');
  }

  if (journalCount >= 5) {
    summaries.push('Great job journaling regularly this week!');
  } else if (journalCount > 0) {
    summaries.push('You journaled a few times this week. Keep it up!');
  }

  if (activeGoals > 0) {
    summaries.push(`You're working on ${activeGoals} goal${activeGoals > 1 ? 's' : ''}. Keep going!`);
  }

  return summaries.length > 0 ? summaries.join(' ') : 'Keep tracking to see your progress!';
}

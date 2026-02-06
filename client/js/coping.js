// Breathing exercise functionality
let breathingInterval = null;
let breathingTimeout = null;
let isBreathing = false;
let currentCycle = 0;
let currentPhase = 'ready'; // 'ready', 'inhale', 'hold', 'exhale'

document.addEventListener('DOMContentLoaded', () => {
  const startButton = document.getElementById('start-breathing');
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingInstruction = document.getElementById('breathing-instruction');

  if (startButton && breathingCircle && breathingInstruction) {
    startButton.addEventListener('click', () => {
      if (!isBreathing) {
        startBreathingExercise();
        startButton.textContent = 'Stop Breathing Exercise';
        isBreathing = true;
      } else {
        stopBreathingExercise();
        startButton.textContent = 'Start Breathing Exercise';
        isBreathing = false;
      }
    });
  }

  // Mindfulness exercise buttons
  document.querySelectorAll('.mindfulness-card button').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const card = e.target.closest('.mindfulness-card');
      const title = card.querySelector('h3').textContent;
      startMindfulnessExercise(title);
    });
  });

  // Grounding technique functionality
  initializeGroundingTechnique();
});

function initializeGroundingTechnique() {
  const groundingInputs = document.querySelectorAll('.grounding-input');
  const groundingSteps = document.querySelectorAll('.grounding-step');
  
  // Track completed steps
  let completedSteps = new Set();
  
  groundingInputs.forEach((input, index) => {
    // Add visual feedback on input
    input.addEventListener('input', () => {
      const step = input.closest('.grounding-step');
      const value = input.value.trim();
      
      if (value.length > 0) {
        // Mark step as active
        step.classList.add('border-purple-500', 'bg-purple-50');
        step.classList.remove('border-purple-200');
        completedSteps.add(index);
      } else {
        // Remove active state
        step.classList.remove('border-purple-500', 'bg-purple-50');
        step.classList.add('border-purple-200');
        completedSteps.delete(index);
      }
      
      // Check if all steps are completed
      checkGroundingCompletion();
    });
    
    // Add enter key support
    input.addEventListener('keypress', (e) => {
      if (e.key === 'Enter' && input.value.trim().length > 0) {
        // Move to next input if available
        if (index < groundingInputs.length - 1) {
          groundingInputs[index + 1].focus();
        } else {
          // Last input - check completion
          checkGroundingCompletion();
        }
      }
    });
  });
  
  function checkGroundingCompletion() {
    if (completedSteps.size === 5) {
      // All steps completed - show completion message
      showGroundingCompletion();
    }
  }
  
  function showGroundingCompletion() {
    // Check if completion message already exists
    let completionMsg = document.getElementById('grounding-completion');
    if (completionMsg) return;
    
    const groundingSection = document.querySelector('.grounding-steps');
    if (!groundingSection) return;
    
    completionMsg = document.createElement('div');
    completionMsg.id = 'grounding-completion';
    completionMsg.className = 'mt-6 p-6 bg-gradient-to-r from-green-50 to-teal-50 border-2 border-green-300 rounded-lg text-center';
    completionMsg.innerHTML = `
      <div class="text-4xl mb-3">✨</div>
      <h3 class="text-xl font-semibold text-gray-800 mb-2">Great job! You've completed the grounding exercise.</h3>
      <p class="text-gray-600 mb-4">Take a moment to notice how you feel now compared to when you started.</p>
      <button id="reset-grounding" class="btn-secondary">Start Over</button>
    `;
    
    groundingSection.parentElement.appendChild(completionMsg);
    
    // Reset button
    document.getElementById('reset-grounding').addEventListener('click', () => {
      groundingInputs.forEach(input => {
        input.value = '';
        const step = input.closest('.grounding-step');
        step.classList.remove('border-purple-500', 'bg-purple-50');
        step.classList.add('border-purple-200');
      });
      completedSteps.clear();
      completionMsg.remove();
      groundingInputs[0].focus();
    });
  }
}

function startBreathingExercise() {
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const cycleCount = document.getElementById('cycle-count');
  
  currentCycle = 0;
  currentPhase = 'ready';
  
  // Reset circle to initial state
  breathingCircle.style.transform = 'scale(1)';
  breathingCircle.style.transition = 'transform 4s ease-in-out, background-color 2s ease-in-out';
  breathingCircle.style.background = 'linear-gradient(to bottom right, #E9D5FF, #A5F3FC)';
  
  // Start first cycle
  startBreathingCycle();
}

function startBreathingCycle() {
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const cycleCount = document.getElementById('cycle-count');
  
  if (currentCycle >= 5) {
    // Exercise complete
    stopBreathingExercise();
    breathingInstruction.textContent = 'Exercise Complete! 🎉';
    breathingCircle.style.transform = 'scale(1)';
    breathingCircle.style.background = 'linear-gradient(to bottom right, #D1FAE5, #A7F3D0)';
    const startBtn = document.getElementById('start-breathing');
    if (startBtn) {
      startBtn.textContent = 'Start Breathing Exercise';
    }
    isBreathing = false;
    return;
  }
  
  // Phase 1: Inhale (4 seconds)
  currentPhase = 'inhale';
  breathingInstruction.textContent = 'Breathe In...';
  breathingCircle.style.transform = 'scale(1.4)';
  breathingCircle.style.background = 'linear-gradient(to bottom right, #A78BFA, #8B5CF6)';
  
  if (cycleCount) {
    cycleCount.textContent = currentCycle + 1;
  }
  
  breathingTimeout = setTimeout(() => {
    // Phase 2: Hold (2 seconds)
    currentPhase = 'hold';
    breathingInstruction.textContent = 'Hold...';
    
    breathingTimeout = setTimeout(() => {
      // Phase 3: Exhale (4 seconds)
      currentPhase = 'exhale';
      breathingInstruction.textContent = 'Breathe Out...';
      breathingCircle.style.transform = 'scale(1)';
      breathingCircle.style.background = 'linear-gradient(to bottom right, #CCFBF1, #99F6E4)';
      
      breathingTimeout = setTimeout(() => {
        // Complete cycle, start next one
        currentCycle++;
        startBreathingCycle();
      }, 4000);
    }, 2000);
  }, 4000);
}

function stopBreathingExercise() {
  // Clear all timeouts
  if (breathingTimeout) {
    clearTimeout(breathingTimeout);
    breathingTimeout = null;
  }
  if (breathingInterval) {
    clearInterval(breathingInterval);
    breathingInterval = null;
  }
  
  const breathingCircle = document.getElementById('breathing-circle');
  const breathingInstruction = document.getElementById('breathing-instruction');
  const cycleCount = document.getElementById('cycle-count');
  
  if (breathingCircle) {
    breathingCircle.style.transform = 'scale(1)';
    breathingCircle.style.transition = 'transform 0.5s ease-in-out, background-color 0.5s ease-in-out';
    breathingCircle.style.background = 'linear-gradient(to bottom right, #E9D5FF, #A5F3FC)';
  }
  if (breathingInstruction) {
    breathingInstruction.textContent = 'Ready to begin';
  }
  if (cycleCount) {
    cycleCount.textContent = '0';
  }
  
  currentCycle = 0;
  currentPhase = 'ready';
}

function startMindfulnessExercise(exerciseName) {
  // Get exercise-specific instructions
  const exerciseInstructions = getExerciseInstructions(exerciseName);
  
  // Show modal or guide for the exercise
  const modal = document.createElement('div');
  modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
  modal.innerHTML = `
    <div class="bg-white rounded-lg p-8 max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
      <h2 class="text-2xl font-bold mb-4">${exerciseName}</h2>
      <p class="text-gray-600 mb-6">${exerciseInstructions.description}</p>
      <div class="space-y-3 mb-6">
        ${exerciseInstructions.steps.map((step, index) => 
          `<p class="text-sm text-gray-700 flex items-start">
            <span class="font-bold text-purple-600 mr-2">${index + 1}.</span>
            <span>${step}</span>
          </p>`
        ).join('')}
      </div>
      <div class="flex space-x-4">
        <button class="btn-primary flex-1" id="start-exercise-btn">Start Exercise</button>
        <button class="btn-secondary flex-1" id="close-exercise-modal">Close</button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  
  let exerciseInterval = null;
  let currentStep = 0;
  
  modal.querySelector('#close-exercise-modal').addEventListener('click', () => {
    if (exerciseInterval) clearInterval(exerciseInterval);
    modal.remove();
  });
  
  modal.querySelector('#start-exercise-btn').addEventListener('click', () => {
    // Start the guided exercise
    const exerciseContent = modal.querySelector('.space-y-3');
    const startBtn = modal.querySelector('#start-exercise-btn');
    const closeBtn = modal.querySelector('#close-exercise-modal');
    
    startBtn.style.display = 'none';
    closeBtn.textContent = 'Stop Exercise';
    
    // Show guided steps
    showGuidedStep(exerciseContent, exerciseInstructions, 0, () => {
      // Exercise complete
      exerciseContent.innerHTML = `
        <div class="text-center py-8">
          <div class="text-6xl mb-4">✨</div>
          <p class="text-lg font-semibold mb-2">Exercise Complete!</p>
          <p class="text-sm text-gray-600">Great job taking time for yourself.</p>
        </div>
      `;
      
      closeBtn.textContent = 'Close';
      closeBtn.onclick = () => modal.remove();
      
      setTimeout(() => {
        if (modal.parentElement) {
          modal.remove();
        }
      }, 3000);
    });
  });
  
  // Close on background click
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      if (exerciseInterval) clearInterval(exerciseInterval);
      modal.remove();
    }
  });
}

function getExerciseInstructions(exerciseName) {
  const instructions = {
    'Body Scan': {
      description: 'A progressive relaxation technique to release tension throughout your body. Focus on each body part systematically.',
      steps: [
        'Find a comfortable position, lying down or sitting',
        'Close your eyes and take 3 deep breaths',
        'Start by focusing on your toes - notice any sensations',
        'Slowly move your attention up through your feet, ankles, legs',
        'Continue through your torso, arms, and hands',
        'Move to your neck, face, and head',
        'Take a moment to feel your whole body relaxed',
        'When ready, slowly open your eyes'
      ],
      duration: 60000 // 60 seconds
    },
    'Progressive Muscle Relaxation': {
      description: 'Tense and release muscle groups to reduce physical stress. This helps you recognize and release tension.',
      steps: [
        'Sit or lie in a comfortable position',
        'Take 3 deep breaths to center yourself',
        'Tense your feet muscles for 5 seconds, then release',
        'Tense your leg muscles for 5 seconds, then release',
        'Tense your stomach and back for 5 seconds, then release',
        'Tense your hands and arms for 5 seconds, then release',
        'Tense your shoulders and neck for 5 seconds, then release',
        'Tense your face muscles for 5 seconds, then release',
        'Take a final deep breath and notice the relaxation'
      ],
      duration: 90000 // 90 seconds
    },
    'Guided Meditation': {
      description: 'Follow a guided meditation to find inner peace and calm. Let thoughts come and go without judgment.',
      steps: [
        'Find a quiet, comfortable space',
        'Sit with your back straight but relaxed',
        'Close your eyes and take 5 deep breaths',
        'Focus on your breath - in and out',
        'When your mind wanders, gently return to your breath',
        'Notice any sounds, sensations, or thoughts without judgment',
        'Continue breathing naturally for a few minutes',
        'Slowly bring your attention back to the room',
        'Open your eyes when you\'re ready'
      ],
      duration: 120000 // 2 minutes
    },
    'Visualization': {
      description: 'Use visualization techniques to create a peaceful mental space. Imagine a safe, calming place in detail.',
      steps: [
        'Close your eyes and take 3 deep breaths',
        'Imagine a peaceful place - a beach, forest, or garden',
        'Notice the colors, sounds, and smells in this place',
        'Feel the temperature and any gentle breeze',
        'Walk around and explore this safe space',
        'Find a comfortable spot to rest in this place',
        'Feel the peace and calm surrounding you',
        'Take this feeling with you as you slowly return',
        'Open your eyes when ready, carrying the calm with you'
      ],
      duration: 90000 // 90 seconds
    }
  };
  
  return instructions[exerciseName] || {
    description: 'A guided mindfulness exercise. Follow the instructions and take your time.',
    steps: [
      'Find a comfortable position',
      'Close your eyes if comfortable',
      'Follow the guided instructions',
      'Take deep, slow breaths',
      'Be present in the moment'
    ],
    duration: 60000
  };
}

function showGuidedStep(container, instructions, stepIndex, onComplete) {
  if (stepIndex >= instructions.steps.length) {
    onComplete();
    return;
  }
  
  const step = instructions.steps[stepIndex];
  const stepDuration = instructions.duration / instructions.steps.length;
  
  container.innerHTML = `
    <div class="text-center py-6">
      <div class="text-6xl mb-6">${stepIndex === 0 ? '🧘' : stepIndex === instructions.steps.length - 1 ? '✨' : '💫'}</div>
      <div class="mb-4">
        <p class="text-2xl font-semibold text-purple-600 mb-2">Step ${stepIndex + 1} of ${instructions.steps.length}</p>
        <p class="text-lg text-gray-700 leading-relaxed">${step}</p>
      </div>
      <div class="mt-6">
        <div class="w-full bg-gray-200 rounded-full h-3 mb-2">
          <div id="step-progress" class="bg-purple-500 h-3 rounded-full transition-all duration-500" style="width: ${(stepIndex / instructions.steps.length) * 100}%"></div>
        </div>
        <p class="text-sm text-gray-500">Take your time with this step</p>
      </div>
    </div>
  `;
  
  // Animate progress bar
  const progressBar = document.getElementById('step-progress');
  let progress = (stepIndex / instructions.steps.length) * 100;
  const targetProgress = ((stepIndex + 1) / instructions.steps.length) * 100;
  
  const progressInterval = setInterval(() => {
    progress += 0.5;
    if (progressBar) {
      progressBar.style.width = Math.min(progress, targetProgress) + '%';
    }
    
    if (progress >= targetProgress) {
      clearInterval(progressInterval);
    }
  }, stepDuration / 200);
  
  // Move to next step after duration
  setTimeout(() => {
    clearInterval(progressInterval);
    showGuidedStep(container, instructions, stepIndex + 1, onComplete);
  }, stepDuration);
}

// Add CSS for breathing circle
const style = document.createElement('style');
style.textContent = `
  .breathing-circle {
    transition: transform 4s ease-in-out, background 2s ease-in-out;
    cursor: pointer;
  }
  
  .breathing-circle:hover {
    opacity: 0.9;
  }
  
  #breathing-counter {
    font-size: 1.1rem;
    font-weight: 500;
  }
  
  #cycle-count {
    font-weight: 700;
    color: #8B5CF6;
  }
`;
document.head.appendChild(style);

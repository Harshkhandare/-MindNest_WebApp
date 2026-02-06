// Mock resources data - in production, this would come from a database
const resources = [
  {
    id: 1,
    title: 'Understanding Depression: A Comprehensive Guide',
    category: 'understanding',
    type: 'article',
    excerpt: 'Learn about the symptoms, causes, and evidence-based treatments for depression.',
    readTime: 5,
    content: 'Depression is a common mental health condition...',
    tags: ['depression', 'mental-health', 'education']
  },
  {
    id: 2,
    title: 'Cognitive Behavioral Therapy (CBT) Explained',
    category: 'treatment',
    type: 'article',
    excerpt: 'Discover how CBT can help manage depression symptoms.',
    readTime: 7,
    content: 'CBT is a form of psychotherapy...',
    tags: ['cbt', 'therapy', 'treatment']
  },
  {
    id: 3,
    title: 'Mindfulness Meditation for Depression',
    category: 'coping',
    type: 'video',
    excerpt: 'A guided meditation session to help manage depressive symptoms.',
    readTime: 10,
    content: 'https://example.com/video/mindfulness',
    tags: ['mindfulness', 'meditation', 'coping']
  },
  {
    id: 4,
    title: 'Medication Options for Depression',
    category: 'treatment',
    type: 'article',
    excerpt: 'Understanding antidepressant medications and their effects.',
    readTime: 8,
    content: 'Antidepressants are commonly prescribed...',
    tags: ['medication', 'treatment', 'pharmaceuticals']
  },
  {
    id: 5,
    title: 'Building a Support Network',
    category: 'coping',
    type: 'article',
    excerpt: 'Tips for creating and maintaining supportive relationships.',
    readTime: 6,
    content: 'Having a strong support network...',
    tags: ['support', 'relationships', 'coping']
  }
];

exports.getResources = async (req, res) => {
  try {
    const { category, search } = req.query;
    let filteredResources = resources;

    if (category && category !== 'all') {
      filteredResources = filteredResources.filter(r => r.category === category);
    }

    if (search) {
      const searchLower = search.toLowerCase();
      filteredResources = filteredResources.filter(r =>
        r.title.toLowerCase().includes(searchLower) ||
        r.excerpt.toLowerCase().includes(searchLower) ||
        r.tags.some(tag => tag.toLowerCase().includes(searchLower))
      );
    }

    res.json({ resources: filteredResources });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getResourceById = async (req, res) => {
  try {
    const resource = resources.find(r => r.id === parseInt(req.params.id));

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json({ resource });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getCategories = async (req, res) => {
  try {
    const categories = ['all', 'understanding', 'treatment', 'coping', 'medication', 'support'];
    res.json({ categories });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


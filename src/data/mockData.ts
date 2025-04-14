import { ProjectData } from '../components/ProjectCard';

export const mockProjects: ProjectData[] = [
  {
    project_id: 1,
    title: 'Ocean Cleanup Simulator',
    description: 'An interactive game that simulates ocean cleanup efforts and teaches about marine conservation. Players can collect plastic waste, protect marine life, and learn about the impact of pollution on ecosystems.',
    team_name: 'Blue Planet',
    category: 'Games',
    sdgs: [
      { sdg_id: 1, sdg_number: 14, sdg_name: 'Life Below Water' },
      { sdg_id: 2, sdg_number: 13, sdg_name: 'Climate Action' },
      { sdg_id: 3, sdg_number: 4, sdg_name: 'Quality Education' }
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1621451537084-482c73073a0f?q=80&w=1000',
    created_at: new Date().toISOString(),
    average_rating: 4.5,
    total_ratings: 25,
    github_link: 'https://github.com/example/ocean-cleanup',
    status: 'approved'
  },
  {
    project_id: 2,
    title: 'Sustainable City Builder',
    description: 'A city simulation game where players design and build environmentally sustainable urban areas. The game teaches about renewable energy, public transportation, and urban planning.',
    team_name: 'Urban Planners',
    category: 'Games',
    sdgs: [
      { sdg_id: 4, sdg_number: 11, sdg_name: 'Sustainable Cities and Communities' },
      { sdg_id: 5, sdg_number: 7, sdg_name: 'Affordable and Clean Energy' },
      { sdg_id: 6, sdg_number: 9, sdg_name: 'Industry, Innovation and Infrastructure' }
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1518005068251-37900150dfca?q=80&w=1000',
    created_at: new Date().toISOString(),
    average_rating: 4.8,
    total_ratings: 32,
    github_link: 'https://github.com/example/sustainable-city',
    status: 'approved'
  },
  {
    project_id: 3,
    title: 'Climate Change Visualization',
    description: 'An interactive data visualization that shows the effects of climate change over time. Users can explore temperature changes, sea level rise, and greenhouse gas emissions data.',
    team_name: 'Data Visualizers',
    category: 'Web Applications',
    sdgs: [
      { sdg_id: 7, sdg_number: 13, sdg_name: 'Climate Action' },
      { sdg_id: 8, sdg_number: 15, sdg_name: 'Life on Land' },
      { sdg_id: 9, sdg_number: 17, sdg_name: 'Partnerships for the Goals' }
    ],
    thumbnail_url: 'https://images.unsplash.com/photo-1564038057722-50a4362e9a7b?q=80&w=1000',
    created_at: new Date().toISOString(),
    average_rating: 4.7,
    total_ratings: 18,
    github_link: 'https://github.com/example/climate-viz',
    status: 'approved'
  },
  {
    id: '4',
    title: 'Zero Hunger Challenge',
    description: 'An educational game about food sustainability and distribution challenges. Players learn about food waste, sustainable agriculture, and solutions to hunger issues.',
    imageUrl: 'https://images.unsplash.com/photo-1576113744504-88c27304d099?q=80&w=1000',
    sdgs: [2, 12, 3],
    team: {
      name: 'Food Future',
      members: ['John Smith', 'Priya Sharma', 'Thomas Müller']
    },
    category: 'Games'
  },
  {
    id: '5',
    title: 'Clean Energy Explorer',
    description: 'An interactive animation that showcases different types of renewable energy sources and their benefits. Users can learn about solar, wind, hydro, and other clean energy technologies.',
    imageUrl: 'https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?q=80&w=1000',
    sdgs: [7, 9, 13],
    team: {
      name: 'Power Innovators',
      members: ['Olivia Chen', 'Daniel Kim', 'Isabella Rodriguez']
    },
    category: 'Animations'
  },
  {
    id: '6',
    title: 'Gender Equality Stories',
    description: 'An interactive narrative experience that shares stories about gender equality challenges and achievements around the world. The project aims to educate and inspire action.',
    imageUrl: 'https://images.unsplash.com/photo-1522836924445-4478bdeb860c?q=80&w=1000',
    sdgs: [5, 10, 4],
    team: {
      name: 'Equality Coders',
      members: ['Fatima Khan', 'Michael Johnson', 'Yara Alami']
    },
    category: 'Web Applications'
  },
  {
    id: '7',
    title: 'Water Resource Management',
    description: 'A simulation that teaches about water resource management, conservation, and access challenges. Users can explore different scenarios and solutions for water scarcity issues.',
    imageUrl: 'https://images.unsplash.com/photo-1551377101-4a7c7e33a54e?q=80&w=1000',
    sdgs: [6, 12, 15],
    team: {
      name: 'Aqua Solutions',
      members: ['Sarah Wilson', 'James Lee', 'Nina Patel']
    },
    category: 'Web Applications'
  },
  {
    id: '8',
    title: 'Quality Education for All',
    description: 'An educational game that highlights the importance of quality education and the challenges faced in different parts of the world. Players learn about educational inequality and solutions.',
    imageUrl: 'https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?q=80&w=1000',
    sdgs: [4, 10, 1],
    team: {
      name: 'Learning Innovators',
      members: ['David Chen', 'Maya Williams', 'Omar Hassan']
    },
    category: 'Games'
  },
  {
    id: '9',
    title: 'Good Health Simulator',
    description: 'A health education simulation that teaches about disease prevention, healthcare access, and wellness practices. Users learn through interactive scenarios and challenges.',
    imageUrl: 'https://images.unsplash.com/photo-1579154392429-0e6b4e850ad2?q=80&w=1000',
    sdgs: [3, 10, 6],
    team: {
      name: 'Health Coders',
      members: ['Emily Johnson', 'Raj Singh', 'Lisa Chen']
    },
    category: 'Web Applications'
  },
  {
    id: '10',
    title: 'Sustainable Consumption Guide',
    description: 'An interactive guide that educates users about sustainable consumption practices, ethical shopping, and reducing waste. The application provides practical tips and resources.',
    imageUrl: 'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?q=80&w=1000',
    sdgs: [12, 11, 13],
    team: {
      name: 'Green Consumers',
      members: ['Noah Williams', 'Zara Khan', 'Lucas Miller']
    },
    category: 'Web Applications'
  }
];

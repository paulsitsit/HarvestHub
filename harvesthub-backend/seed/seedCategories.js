import 'dotenv/config';
import connectDB from '../src/config/db.js';
import Category from '../src/models/Category.js';

const categories = [
  {
    name: 'Fruits',
    slug: 'fruits',
    icon: '🍎'
  },
  {
    name: 'Vegetables',
    slug: 'vegetables',
    icon: '🥬'
  },
  {
    name: 'Root Crops',
    slug: 'root-crops',
    icon: '🥔'
  },
  {
    name: 'Grains',
    slug: 'grains',
    icon: '🌾'
  },
  {
    name: 'Herbs',
    slug: 'herbs',
    icon: '🌿'
  },
  {
    name: 'Spices',
    slug: 'spices',
    icon: '🌶️'
  },
  {
    name: 'Legumes',
    slug: 'legumes',
    icon: '🫘'
  },
  {
    name: 'Flowers',
    slug: 'flowers',
    icon: '🌼'
  },
  {
    name: 'Other Produce',
    slug: 'other-produce',
    icon: '🧺'
  }
];

const seedCategories = async () => {
  try {
    await connectDB();

    for (const category of categories) {
      await Category.findOneAndUpdate(
        {
          slug: category.slug
        },
        category,
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true
        }
      );
    }

    console.log(`${categories.length} categories seeded successfully`);
    process.exit(0);
  } catch (error) {
    console.error(`Category seed failed: ${error.message}`);
    process.exit(1);
  }
};

seedCategories();
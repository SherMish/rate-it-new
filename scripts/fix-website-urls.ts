import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

async function fixWebsiteUrls() {
  await connectDB();
  
  // Find all websites without URLs
  const websitesWithoutUrls = await Website.find({ url: { $exists: false } });
  
  console.log(`Found ${websitesWithoutUrls.length} websites without URLs`);
  
  // Delete websites without URLs
  if (websitesWithoutUrls.length > 0) {
    await Website.deleteMany({ url: { $exists: false } });
    console.log('Deleted websites without URLs');
  }
}

fixWebsiteUrls()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fixing website URLs:', error);
    process.exit(1);
  }); 
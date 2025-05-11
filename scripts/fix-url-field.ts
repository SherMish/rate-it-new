import connectDB from '@/lib/mongodb';
import { Website } from '@/lib/models';

async function fixUrlField() {
  await connectDB();
  
  const db = Website.collection;
  
  // Find all documents with uppercase 'URL' field
  const documents = await db.find({ URL: { $exists: true } }).toArray();
  
  console.log(`Found ${documents.length} documents with uppercase 'URL' field`);
  
  for (const doc of documents) {
    // Update each document to use lowercase 'url' field
    await db.updateOne(
      { _id: doc._id },
      {
        $set: { url: doc.URL },
        $unset: { URL: "" }
      }
    );
  }
  
  console.log('Migration completed');
}

fixUrlField()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error('Error fixing URL field:', error);
    process.exit(1);
  }); 
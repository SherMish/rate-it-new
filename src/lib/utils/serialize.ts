/**
 * Utility functions for serializing MongoDB documents for client components
 */

import { Types } from 'mongoose';

/**
 * Converts ObjectId to string, handles undefined/null values
 */
export function serializeObjectId(objectId: Types.ObjectId | string | null | undefined): string | null {
  if (!objectId) return null;
  return objectId.toString();
}

/**
 * Serializes a MongoDB document by converting ObjectIds to strings
 * This prevents the "Objects with toJSON methods are not supported" warning
 * when passing MongoDB documents to Client Components
 */
export function serializeMongoDocument<T extends Record<string, any>>(doc: T): T {
  if (!doc) return doc;
  
  const serialized = { ...doc } as any;
  
  // Convert common ObjectId fields to strings
  if (serialized._id) {
    serialized._id = serializeObjectId(serialized._id);
  }
  
  if (serialized.createdBy) {
    serialized.createdBy = serializeObjectId(serialized.createdBy);
  }
  
  if (serialized.owner) {
    serialized.owner = serializeObjectId(serialized.owner);
  }
  
  if (serialized.relatedWebsite) {
    if (typeof serialized.relatedWebsite === 'object' && serialized.relatedWebsite._id) {
      serialized.relatedWebsite = {
        ...serialized.relatedWebsite,
        _id: serializeObjectId(serialized.relatedWebsite._id),
      };
    } else {
      serialized.relatedWebsite = serializeObjectId(serialized.relatedWebsite);
    }
  }
  
  if (serialized.relatedUser) {
    if (typeof serialized.relatedUser === 'object' && serialized.relatedUser._id) {
      serialized.relatedUser = {
        ...serialized.relatedUser,
        _id: serializeObjectId(serialized.relatedUser._id),
      };
    } else {
      serialized.relatedUser = serializeObjectId(serialized.relatedUser);
    }
  }
  
  if (serialized.relatedCategory) {
    if (typeof serialized.relatedCategory === 'object' && serialized.relatedCategory._id) {
      serialized.relatedCategory = {
        ...serialized.relatedCategory,
        _id: serializeObjectId(serialized.relatedCategory._id),
      };
    } else {
      serialized.relatedCategory = serializeObjectId(serialized.relatedCategory);
    }
  }
  
  // Convert date objects to ISO strings
  if (serialized.createdAt && serialized.createdAt instanceof Date) {
    serialized.createdAt = serialized.createdAt.toISOString();
  }
  
  if (serialized.updatedAt && serialized.updatedAt instanceof Date) {
    serialized.updatedAt = serialized.updatedAt.toISOString();
  }
  
  return serialized as T;
}

/**
 * Serializes an array of MongoDB documents
 */
export function serializeMongoDocuments<T extends Record<string, any>>(docs: T[]): T[] {
  return docs.map(serializeMongoDocument);
}

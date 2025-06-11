import { db } from '../server/db';
import { candidates, users } from '../shared/schema';
import { eq } from 'drizzle-orm';

/**
 * This script updates existing candidates to associate them with a user ID
 * Run with: npx tsx scripts/update-candidates-userid.ts
 */
async function updateCandidatesWithUserId() {
  try {
    // Get admin user
    const adminUsers = await db.query.users.findMany({
      where: eq(users.isAdmin, true),
    });
    
    if (adminUsers.length === 0) {
      console.error('No admin users found. Cannot update candidates.');
      return;
    }
    
    const adminUser = adminUsers[0];
    console.log(`Found admin user: ${adminUser.username} (ID: ${adminUser.id})`);
    
    // Fetch all candidates without a userId
    const allCandidates = await db.select().from(candidates);
    const candidatesWithoutUserId = allCandidates.filter(c => !c.userId);
    
    console.log(`Found ${candidatesWithoutUserId.length} candidates without a user ID`);
    
    // Update all candidates without user ID to belong to the admin user
    if (candidatesWithoutUserId.length > 0) {
      for (const candidate of candidatesWithoutUserId) {
        await db.update(candidates)
          .set({ userId: adminUser.id })
          .where(eq(candidates.id, candidate.id));
        
        console.log(`Updated candidate ${candidate.id} (${candidate.name}) to user ID ${adminUser.id}`);
      }
      
      console.log(`Successfully updated ${candidatesWithoutUserId.length} candidates`);
    } else {
      console.log('No candidates need updating');
    }
  } catch (error) {
    console.error('Error updating candidates:', error);
  } finally {
    process.exit(0);
  }
}

updateCandidatesWithUserId();
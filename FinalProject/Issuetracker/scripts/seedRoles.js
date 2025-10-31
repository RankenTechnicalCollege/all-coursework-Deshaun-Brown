// scripts/seedRoles.js
// Seeds the roles collection with permissions based on Step 1 matrix
import { connect } from '../database.js';

const ROLES = [
  {
    code: 'DEV',
    name: 'Developer',
    permissions: {
      canViewData: true,
      canCreateBug: true,
      canEditMyBug: true,
      canEditIfAssignedTo: true,
      canReassignIfAssignedTo: true,
      canBeAssignedTo: true,
      canLogHours: true,
      canApplyFixInVersion: true,
      canAssignVersionDate: true,
      canAddComment: true,
      canAddTestCase: false,
      canEditTestCase: false,
      canDeleteTestCase: false,
      canEditAnyBug: false,
      canCloseAnyBug: false,
      canClassifyAnyBug: false,
      canReassignAnyBug: false,
      canEditAnyUser: false,
      canAssignRoles: false,
    },
  },
  {
    code: 'QA',
    name: 'Quality Analyst',
    permissions: {
      canViewData: true,
      canCreateBug: true,
      canEditMyBug: true,
      canEditIfAssignedTo: true,
      canReassignIfAssignedTo: true,
      canBeAssignedTo: true,
      canAddComment: true,
      canAddTestCase: true,
      canEditTestCase: true,
      canDeleteTestCase: true,
      canLogHours: false,
      canApplyFixInVersion: false,
      canAssignVersionDate: false,
      canEditAnyBug: false,
      canCloseAnyBug: false,
      canClassifyAnyBug: false,
      canReassignAnyBug: false,
      canEditAnyUser: false,
      canAssignRoles: false,
    },
  },
  {
    code: 'BA',
    name: 'Business Analyst',
    permissions: {
      canViewData: true,
      canCreateBug: true,
      canEditAnyBug: true,
      canCloseAnyBug: true,
      canClassifyAnyBug: true,                                              
      canReassignAnyBug: true,
      canEditIfAssignedTo: true,
      canReassignIfAssignedTo: true,
      canBeAssignedTo: true,
      canAddComment: true,
      canAddTestCase: false,
      canEditTestCase: false,
      canDeleteTestCase: false,
      canLogHours: false,
      canApplyFixInVersion: false,
      canAssignVersionDate: false,
      canEditAnyUser: false,
      canAssignRoles: false,
      canEditMyBug: false,
    },
  },
  {
    code: 'PM',
    name: 'Product Manager',
    permissions: {
      canViewData: true,
      canCreateBug: true,
      canEditMyBug: true,
      canEditIfAssignedTo: true,
      canReassignIfAssignedTo: true,
      canBeAssignedTo: true,
      canAddComment: true,
      canAddTestCase: false,
      canEditTestCase: false,
      canDeleteTestCase: false,
      canLogHours: false,
      canApplyFixInVersion: false,
      canAssignVersionDate: false,
      canEditAnyBug: false,
      canCloseAnyBug: false,
      canClassifyAnyBug: false,
      canReassignAnyBug: false,
      canEditAnyUser: false,
      canAssignRoles: false,
    },
  },
  {
    code: 'TM',
    name: 'Technical Manager',
    permissions: {
      canViewData: true,
      canAssignRoles: true,
      canEditAnyUser: true,
      canEditAnyBug: true,
      canReassignAnyBug: true,
      canEditIfAssignedTo: true,
      canReassignIfAssignedTo: true,
      canBeAssignedTo: true,
      canAddComment: true,
      canCreateBug: false,
      canCloseAnyBug: false,
      canClassifyAnyBug: false,
      canAddTestCase: false,
      canEditTestCase: false,
      canDeleteTestCase: false,
      canLogHours: false,
      canApplyFixInVersion: false,
      canAssignVersionDate: false,
      canEditMyBug: true,
    },
  },
];

async function seed() {
  const db = await connect();
  const col = db.collection('roles');
  const now = new Date();

  let upserted = 0;
  for (const role of ROLES) {
    const result = await col.updateOne(
      { code: role.code },
      { $set: { ...role, updatedAt: now }, $setOnInsert: { createdAt: now } },
      { upsert: true }
    );
    if (result.upsertedCount || result.matchedCount) upserted++;
  }

  const all = await col.find({}).toArray();
  console.log(`Seeded roles (${upserted} upserts). Current roles in DB: ${all.length}`);
  for (const r of all) {
    console.log(`- ${r.code} (${r.name})`);
  }
}

seed()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Seed roles failed:', err);
    process.exit(1);
  });

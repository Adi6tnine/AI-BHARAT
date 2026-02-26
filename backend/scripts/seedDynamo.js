/**
 * Seed DynamoDB with PM Kisan rules
 * 
 * Run this script after deploying the backend:
 * node scripts/seedDynamo.js
 */

import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, PutCommand } from '@aws-sdk/lib-dynamodb';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize DynamoDB client
const client = new DynamoDBClient({ region: 'ap-south-1' });
const docClient = DynamoDBDocumentClient.from(client);

const TABLE_NAME = 'SchemeRules';

async function seedDatabase() {
  try {
    console.log('Loading PM Kisan rules from JSON file...');
    
    // Load rules from JSON file
    const rulesPath = join(__dirname, '../data/pmkisan_rules.json');
    const rulesData = JSON.parse(readFileSync(rulesPath, 'utf8'));
    
    console.log(`Loaded rules for scheme: ${rulesData.schemeId}`);
    
    // Prepare item for DynamoDB
    const item = {
      schemeId: rulesData.schemeId,
      version: rulesData.version,
      data: rulesData,
      lastUpdated: new Date().toISOString()
    };
    
    console.log(`Putting item into DynamoDB table: ${TABLE_NAME}...`);
    
    // Put item into DynamoDB
    const command = new PutCommand({
      TableName: TABLE_NAME,
      Item: item
    });
    
    await docClient.send(command);
    
    console.log('✅ Successfully seeded DynamoDB with PM Kisan rules!');
    console.log(`   Scheme ID: ${rulesData.schemeId}`);
    console.log(`   Version: ${rulesData.version}`);
    console.log(`   Table: ${TABLE_NAME}`);
    
  } catch (error) {
    console.error('❌ Error seeding database:', error);
    
    if (error.name === 'ResourceNotFoundException') {
      console.error('\nThe DynamoDB table does not exist.');
      console.error('Make sure you have deployed the backend first:');
      console.error('  cd backend');
      console.error('  sam build');
      console.error('  sam deploy --guided');
    } else if (error.name === 'CredentialsProviderError') {
      console.error('\nAWS credentials not configured.');
      console.error('Run: aws configure');
    }
    
    process.exit(1);
  }
}

// Run the seed function
seedDatabase();

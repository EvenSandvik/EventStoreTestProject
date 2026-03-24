import { randomUUID } from 'node:crypto';
import {
  FORWARDS,
  START,
  EventStoreDBClient,
  jsonEvent,
} from '@eventstore/db-client';

const connectionString = 'esdb://localhost:2113?tls=false';
const streamName = 'order-123';
const useFreshStream = process.argv.includes('--fresh');
const streamSuffix = useFreshStream ? randomUUID() : 'demo';
const targetStream = `${streamName}-${streamSuffix}`;

const client = EventStoreDBClient.connectionString(connectionString);

async function appendSampleEvents() {
  const events = [
    jsonEvent({
      type: 'order-created',
      data: {
        orderId: '123',
        customerId: 'customer-42',
        total: 499,
      },
    }),
    jsonEvent({
      type: 'order-confirmed',
      data: {
        orderId: '123',
        confirmedAt: new Date().toISOString(),
      },
    }),
  ];

  await client.appendToStream(targetStream, events, {
    expectedRevision: 'any',
  });
}

async function readEvents() {
  const events = client.readStream(targetStream, {
    direction: FORWARDS,
    fromRevision: START,
    maxCount: 100,
  });

  const collected = [];

  for await (const resolvedEvent of events) {
    if (!resolvedEvent.event) {
      continue;
    }

    collected.push({
      id: resolvedEvent.event.id,
      type: resolvedEvent.event.type,
      revision: resolvedEvent.event.revision,
      data: resolvedEvent.event.data,
    });
  }

  return collected;
}

async function main() {
  console.log(`Connecting to ${connectionString}`);
  console.log(`Using stream: ${targetStream}`);

  await appendSampleEvents();
  console.log('Appended sample events.');

  const events = await readEvents();

  console.log('Read events from stream:');
  console.log(JSON.stringify(events, null, 2));
}

main()
  .catch((error) => {
    console.error('Failed to run EventStoreDB sample.');
    console.error(error.message);

    if (error.code === 'ECONNREFUSED') {
      console.error('Start EventStoreDB first with: npm run db:up');
    }

    process.exitCode = 1;
  })
  .finally(async () => {
    await client.dispose();
  });
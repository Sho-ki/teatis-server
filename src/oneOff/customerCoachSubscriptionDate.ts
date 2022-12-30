import { PrismaClient } from '@prisma/client';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const updateCustomerCoachSubscriptionDate = async() => {

  const client = new PrismaClient();
  const response = await client.customers.findMany(
    { where: { coachId: 1 } });

  const serviceId = process.env.TWILIO_SERVICE_SID;
  const twilioChannelUrl = `https://chat.twilio.com/v2/Services/${serviceId}/Channels?PageSize=200`;
  const username = process.env.TWILIO_ACCOUNT_SID;
  const password = process.env.TWILIO_AUTH_TOKEN;

  const tst = await axios.get(twilioChannelUrl, { auth: { username, password } });
  // eslint-disable-next-line no-console
  console.log(tst.data.channels[2].friendly_name);
  return;
  for(const customer of response){
    await client.customerEventLog.createMany(
      { data: [{ customerId: customer.id, type: 'boxSubscribed', eventDate: customer.createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):customer.createdAt }, { customerId: customer.id, type: 'coachingSubscribed', eventDate: customer.createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):customer.createdAt }] });
    await client.customers.update(
      {
        where: { id: customer.id },
        data: { coachingSubscribed: 'active', boxSubscribed: 'active' },
      });
  }
};

updateCustomerCoachSubscriptionDate();

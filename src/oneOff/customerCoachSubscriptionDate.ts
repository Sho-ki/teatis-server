/* eslint-disable no-console */
import { PrismaClient } from '@prisma/client';
import axios from 'axios';
// eslint-disable-next-line @typescript-eslint/no-var-requires
require('dotenv').config();

const updateCustomerCoachSubscriptionDate = async() => {

  const client = new PrismaClient();
  const response = await client.customers.findMany(
    { where: { coachId: 1 } });

  const serviceId = process.env.TWILIO_SERVICE_SID;
  const username = process.env.TWILIO_ACCOUNT_SID;
  const password = process.env.TWILIO_AUTH_TOKEN;

  const twilioChannelUrl = `https://chat.twilio.com/v2/Services/${serviceId}/Channels?PageSize=200`;

  const data = await axios.get(twilioChannelUrl, { auth: { username, password } });
  const list = data.data.channels.map(({ friendly_name, sid }) => { return { friendly_name, sid }; });

  for(let i = 0; i < response.length; i++){

    const rechargeUrl = 'https://api.rechargeapps.com//customers?email=' + response[i].email;
    const rechargeData = await axios.get(rechargeUrl, { headers: { 'X-Recharge-Access-Token': 'sk_1x1_828119b467d40b545070d8d016d15061882f6d44cc0c6b5756a0f9d6e27dd5cb' } });
    console.log(response[i].email);

    if(!rechargeData.data.customers.length) continue;
    console.log(rechargeData.data.customers[0].status);
    const status = rechargeData.data.customers[0].status;
    console.log(status);

    if(status === 'INACTIVE'){
      await client.customers.update(
        {
          where: { id: response[i].id },
          data: { boxSubscribed: 'inactive', coachingSubscribed: 'inactive' },
        });
      await client.customerEventLog.createMany(
        { data: [{ customerId: response[i].id, type: 'boxUnsubscribed', eventDate: new Date() }, { customerId: response[i].id, type: 'coachingUnsubscribed', eventDate: new Date() }] });

      console.log('OK');
    }
    const customerName = `${response[i].firstName} ${response[i].lastName}`;
    console.log(customerName);

    const channel = list.find(({ friendly_name }) => { return friendly_name === customerName; });
    if(channel){
      const channelSid = channel.sid;
      await client.customerEventLog.createMany(
        { data: [{ customerId: response[i].id, type: 'boxSubscribed', eventDate: response[i].createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):response[i].createdAt }, { customerId: response[i].id, type: 'coachingSubscribed', eventDate: response[i].createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):response[i].createdAt }] });
      await client.customers.update(
        {
          where: { id: response[i].id },
          data: { twilioChannelSid: channelSid },
        });
    }

    console.log(i);
    console.log('_______________________________________________');
  }
};

updateCustomerCoachSubscriptionDate();

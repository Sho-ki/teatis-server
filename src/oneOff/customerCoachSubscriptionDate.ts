import { PrismaClient } from '@prisma/client';

const updateCustomerCoachSubscriptionDate = async() => {

  const client = new PrismaClient();
  const response = await client.customers.findMany(
    { where: { coachId: 1 } });

  for(const customer of response){
    await client.customerEventLog.createMany(
      { data: [{ customerId: customer.id, type: 'boxSubscribed', eventDate: customer.createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):customer.createdAt }, { customerId: customer.id, type: 'coachingSubscribed', eventDate: customer.createdAt <= new Date('2022-12-06')?new Date('2022-12-06'):customer.createdAt }] });
  }
};

updateCustomerCoachSubscriptionDate();

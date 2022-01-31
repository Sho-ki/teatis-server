// // Get a customer's last order

// // Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// // Create an original box for a customer

// import { GraphQLClient, gql } from 'graphql-request';

// async function main() {
//   const endpoint = 'https://public-api.shiphero.com/graphql';

//   const graphQLClient = new GraphQLClient(endpoint, {
//     headers: {
//
//   });

//   const query = gql`
//     {
//       products {
//         complexity
//         request_id
//         data(first: 10) {
//           edges {
//             node {
//               id
//               sku
//               name
//               warehouse_products {
//                 id
//                 warehouse_id
//                 on_hand
//               }
//             }
//           }
//         }
//       }
//     }
//   `;

//   const data = await graphQLClient.request(query);
//   console.log(JSON.stringify(data, undefined, 2));
// }

// main().catch((error) => console.error(error));

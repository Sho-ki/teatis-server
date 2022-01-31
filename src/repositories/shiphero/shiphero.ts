// Get a customer's last order

// Get a customer's order histories (get all the products that cannot be sent again, and be sent again)

// Create an original box for a customer

import { GraphQLClient, gql } from 'graphql-request';

async function main() {
  const endpoint = 'https://public-api.shiphero.com/graphql';

  const graphQLClient = new GraphQLClient(endpoint, {
    headers: {
      authorization:
        'Bearer eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6IlJUQXlOVU13T0Rrd09ETXhSVVZDUXpBNU5rSkVOVVUxUmtNeU1URTRNMEkzTWpnd05ERkdNdyJ9.eyJodHRwOi8vc2hpcGhlcm8tcHVibGljLWFwaS91c2VyaW5mbyI6eyJuYW1lIjoieXVpY2hpQHRlYXRpc21lYWwuY29tIiwibmlja25hbWUiOiJ5dWljaGkiLCJwaWN0dXJlIjoiaHR0cHM6Ly9zLmdyYXZhdGFyLmNvbS9hdmF0YXIvMWQwNWRlMzhiM2UyNDU4ZmUxNDk3YjQ5ZGVlMjY3MTQ_cz00ODAmcj1wZyZkPWh0dHBzJTNBJTJGJTJGY2RuLmF1dGgwLmNvbSUyRmF2YXRhcnMlMkZ5dS5wbmciLCJhY2NvdW50X2lkIjoiNjUwNDkiLCJpc19hY2NvdW50X2FkbWluIjpmYWxzZX0sImlzcyI6Imh0dHBzOi8vbG9naW4uc2hpcGhlcm8uY29tLyIsInN1YiI6ImF1dGgwfDE3NjI1MCIsImF1ZCI6WyJzaGlwaGVyby1wdWJsaWMtYXBpIiwiaHR0cHM6Ly9zaGlwaGVyby5hdXRoMC5jb20vdXNlcmluZm8iXSwiaWF0IjoxNjQxMzU1NzAyLCJleHAiOjE2NDM3NzQ5MDIsImF6cCI6Im10Y2J3cUkycjYxM0RjT04zRGJVYUhMcVF6UTRka2huIiwic2NvcGUiOiJvcGVuaWQgcHJvZmlsZSB2aWV3OnByb2R1Y3RzIGNoYW5nZTpwcm9kdWN0cyB2aWV3Om9yZGVycyBjaGFuZ2U6b3JkZXJzIHZpZXc6cHVyY2hhc2Vfb3JkZXJzIGNoYW5nZTpwdXJjaGFzZV9vcmRlcnMgdmlldzpzaGlwbWVudHMgY2hhbmdlOnNoaXBtZW50cyB2aWV3OnJldHVybnMgY2hhbmdlOnJldHVybnMgdmlldzp3YXJlaG91c2VfcHJvZHVjdHMgY2hhbmdlOndhcmVob3VzZV9wcm9kdWN0cyB2aWV3OnBpY2tpbmdfc3RhdHMgdmlldzpwYWNraW5nX3N0YXRzIG9mZmxpbmVfYWNjZXNzIiwiZ3R5IjoicGFzc3dvcmQifQ.J8-r1Kn6TOQ8fjNRKdMIhaO3bT2nDCyySo9Vgk3nQ3YZ0RAQE8NhJFQoefe1cSYYjL1WE30G6lCUp5CnhkBFSxYndQsXdg7UWaW-r4B5-7BNRk0vvzXxlt546rvumh5fsg6LiFJVeBwUl-0VbLnKr4cNnzuD0p9X3FNh3G0sVIRW7vRm-4P_2YljPE9zp33iMegXhwtxcwv8qoegrQ-_8vzJ51nitiuR9yfV6UqlhyeD1em4-8b2bP7t3XX1dkpl5-0ol-nc8dcll_iGfEyHSgD7xiGQWQAeYM9v_bZjqQVI_nN_8HyPRlw8w20Vg4jhCc_xZh-JTDnLW8Ir0OvScQ',
    },
  });

  const query = gql`
    {
      products {
        complexity
        request_id
        data(first: 10) {
          edges {
            node {
              id
              sku
              name
              warehouse_products {
                id
                warehouse_id
                on_hand
              }
            }
          }
        }
      }
    }
  `;

  const data = await graphQLClient.request(query);
  console.log(JSON.stringify(data, undefined, 2));
}

main().catch((error) => console.error(error));

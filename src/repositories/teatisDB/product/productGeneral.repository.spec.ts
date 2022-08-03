import {cleanUpPrismaClient, prismaForTest, setUpPrismaClient} from "../../../testUtils/prismaClientForTest";
import {PrismaService} from "../../../prisma.service";
import { ProductGeneralRepository } from "./productGeneral.repository";

describe('productGeneral', () => {
  describe('with existing posts', () => {
    beforeEach(() => {
      setUpPrismaClient()
    });

    afterEach(async () => {
      await cleanUpPrismaClient();
    });

    describe("#getExistingProductIngredients", () => {
      beforeEach(async () => {
        await prismaForTest.product.create({
          data: {
            name: "test",
            label: "test",
            externalSku: "1234",
            productNutritionFact: {
              create: {
                calories: 200
              }
            },
            productProvider: {
              create: {
                provider: "test_provider"
              }
            }
          }
        })
      })

      it("retrieves product objects that matches the sku", async () => {
        const repository = new ProductGeneralRepository(prismaForTest as PrismaService)
        const [products] = await repository.getProductsBySku({ products: [{sku: "1234"}]})
        expect(products.length).toEqual(1)
      })
    })
  });
});
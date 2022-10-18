/**
 * @param {*} shim DatastoreShim オブジェクトとなっている
 * @param {import("@prisma/client")} prisma6666
 *
 * @see https://newrelic.github.io/node-newrelic/docs/DatastoreShim.html
 */
export const instrumentPrisma = (shim, prisma) => {
  // ここで New Relic 上で表示される文字列を設定することができます。任意の文字列を設定することもできます。
  shim.setDatastore(shim.POSTGRES);
  shim.recordQuery(prisma.PrismaClient.prototype, '_executeRequest', {
    query: (_shim, _fn, _name, args) => {
      const params = args[0];
      const query = {
        collection: params.model,
        operation: params.action,
        // SQL の代わりとなりそうな情報を取得する
        query: `${params.clientMethod} ${JSON.stringify(params.args)}`,
      };
      return JSON.stringify(query);
    },
    // New Relic上でデータベースとしての情報として記録してもらうために指定をします。
    record: true,
    // _executeRequest が非同期関数のため、それに関する指定をしています。
    promise: true,
  });

  shim.setParser((query) => {
    return JSON.parse(query);
  });
};

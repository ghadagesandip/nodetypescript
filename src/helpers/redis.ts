import * as redis from 'redis';
export const redisClient: any = redis.createClient();

export async function isBacKlisted(userId: string, token: string): Promise<any> {

    return new Promise <any> (

        (resolve: (value: any) => void, reject: (error: any) => void): void => {

            redisClient.get(`blacklist_token_${userId}`, (err: any, value: any) => {

                if (err) {
                    reject(err);
                } else {
                    // tslint:disable-next-line:possible-timing-attack
                    value === token ? resolve(true) : resolve(false);
                }
            });
        });
}

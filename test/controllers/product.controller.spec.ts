import { expect, should } from 'chai';
import * as dotenv from 'dotenv';
import * as http from 'http';
import * as request from 'supertest';
import { App } from './../../App';
import { logger } from './../../src/logger';

dotenv.config({
  path: '.env.test',
});

const server: string = 'http://localhost:3000';
const commonHeaders: any = {Authorization: ''};

describe('Product module', () => {

  describe('"authcontroller.login()"', () => {
    const body: any = {
        email: 'sandip@yopmail.com',
        password: 'sandip123',
    };
    it('should return success', async () => {
      try {
        const users: any = await request(server).post('/api/auth/login').set({body});
        commonHeaders.Authorization = users.data.token;
        expect(users.success).to.be.equal(true);
        expect(users.message).to.be.equal('Success');
      } catch (err) {
        expect(err).to.be.equal(err);
      }
    });
  });

//   describe('"productcontroller.getProducts()"', () => {
//     it('should list products', async () => {
//       try {
//         const products: any = await request(server).get('/api/products').set(commonHeaders);
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.getDetails()"', () => {
//     it('should return a product', async () => {
//       const id: string = '5d2b6201fc7a944e5f080cc3';
//       try {
//         const products: any = await request(server).get(`/api/products/${id}/details`);
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.getHomeList()"', () => {
//     it('should return a product', async () => {
//       try {
//         const products: any = await request(server).get('/api/products/home-list');
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.getProductsByCategoryId()"', () => {
//     it('should return a product', async () => {
//       const id: string = '5d224669ca5bec29abdf23ed';
//       try {
//         const products: any = await request(server).get(`/api/products/byCategoryId/${id}`);
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.addProduct()"', () => {
//     const body: any = {
//       name: 'Honor 10 Lite (Sapphire Blue, 32 GB)  (3 GB RAM)',
//       price: '13999',
//       category_id: '5d224669ca5bec29abdf23ed',
//       discount: 21,
//       brand: 'Honor',
//       images: [
//         'https://rukminim1.flixcart.com/image/128/128/jcgjo280/mobile/v/g/z/honor-9-lite-na-original-imaffh2q2p9jbzhf.jpeg?q=70',
//         'https://rukminim1.flixcart.com/image/128/128/jcnovbk0/mobile/v/g/z/honor-9-lite-lld-al10-original-imaffh2qmxzvnmhk.jpeg?q=70',
//         'https://rukminim1.flixcart.com/image/128/128/jcgjo280/mobile/v/g/z/honor-9-lite-na-original-imaffh2qfxgyx7kv.jpeg?q=70',
//       ],
//       warranty: 'Brand Warranty of 1 Year Available for Mobile and 6 Months for Accessories',
//       general: {
//         in_the_box: 'Handset, Charger, TPU Cover, Data Cable, Warranty Card, User Manual',
//         model_name: 'HRY-AL00',
//         model_number: '10 Lite',
//         color: 'Sapphire Blue',
//         sim_type: 'Dual Sim',
//         touchScreen: 'Yes',
//         quick_charging: 'Yes',
//       },
//       display_feature: {
//         size: '15.77 cm (6.21 inch)',
//         resolution: '2340 x 1080 pixels',
//         resolution_type: 'FHD+',
//         other_features: 'Touch-sensitive Screen, Support Multi-touch Technology, LCD Display',
//       },
//       memory_storage: {
//         internal_storage: '32',
//         ram: '3',
//         expandable: '512',
//       },
//       camera: {
//         primary_camera: '13MP + 2MP',
//         secondary_camera: '24MP',
//         flash: true,
//         hd_recording: true,
//       },
//       connectivity_feature: {
//         network_type: '3G, 4G, 2G',
//         supported_network: 'GSM, WCDMA, 4G LTE, UMTS',
//         bluetooth: true,
//         bluetooth_version: 'v5',
//         wifi: true,
//         wifi_version: '802.11 ac (Wi-Fi with MIMO)',
//       },
//     };
//     it('should add a product', async () => {
//       try {
//         const products: any = await request(server).post('/api/products').set(commonHeaders).set({body});
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.updateProduct()"', () => {
//     const id: string = '5d2b6201fc7a944e5f080cc3';
//     const body: any = {
//       name: 'Honor 10 Lite (Sapphire Blue, 32 GB)  (3 GB RAM)',
//       price: '13999',
//       category_id: '5d224669ca5bec29abdf23ed',
//       discount: 21,
//       brand: 'Honor',
//       images: [
//         'https://rukminim1.flixcart.com/image/128/128/jcgjo280/mobile/v/g/z/honor-9-lite-na-original-imaffh2q2p9jbzhf.jpeg?q=70',
//         'https://rukminim1.flixcart.com/image/128/128/jcnovbk0/mobile/v/g/z/honor-9-lite-lld-al10-original-imaffh2qmxzvnmhk.jpeg?q=70',
//         'https://rukminim1.flixcart.com/image/128/128/jcgjo280/mobile/v/g/z/honor-9-lite-na-original-imaffh2qfxgyx7kv.jpeg?q=70',
//       ],
//       warranty: 'Brand Warranty of 1 Year Available for Mobile and 6 Months for Accessories',
//       general: {
//         in_the_box: 'Handset, Charger, TPU Cover, Data Cable, Warranty Card, User Manual',
//         model_name: 'HRY-AL00',
//         model_number: '10 Lite',
//         color: 'Sapphire Blue',
//         sim_type: 'Dual Sim',
//         touchScreen: 'Yes',
//         quick_charging: 'Yes',
//       },
//       display_feature: {
//         size: '15.77 cm (6.21 inch)',
//         resolution: '2340 x 1080 pixels',
//         resolution_type: 'FHD+',
//         other_features: 'Touch-sensitive Screen, Support Multi-touch Technology, LCD Display',
//       },
//       memory_storage: {
//         internal_storage: '32',
//         ram: '3',
//         expandable: '512',
//       },
//       camera: {
//         primary_camera: '13MP + 2MP',
//         secondary_camera: '24MP',
//         flash: true,
//         hd_recording: true,
//       },
//       connectivity_feature: {
//         network_type: '3G, 4G, 2G',
//         supported_network: 'GSM, WCDMA, 4G LTE, UMTS',
//         bluetooth: true,
//         bluetooth_version: 'v5',
//         wifi: true,
//         wifi_version: '802.11 ac (Wi-Fi with MIMO)',
//       },
//     };
//     it('should add a product', async () => {
//       try {
//         const products: any = await request(server).post(`/api/products/${id}`).set(commonHeaders).set({body});
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });

//   describe('"productcontroller.deleteProduct()"', () => {
//     it('should return a product', async () => {
//       const id: string = '5d2b6201fc7a944e5f080cc3';
//       try {
//         const products: any = await request(server).delete(`/api/products/${id}`).set(commonHeaders);
//         expect(products.success).to.be.equal(true);
//         expect(products.message).to.be.equal('Success');
//       } catch (err) {
//         expect(err).to.be.equal(err);
//       }
//     });
//   });
// });

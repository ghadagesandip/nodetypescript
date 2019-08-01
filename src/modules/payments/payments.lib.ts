import * as Stripe from 'stripe';

const stripe: Stripe = new Stripe(process.env.STRIPE_PAYMENT_GATEWAY_SECRET);

/**
 * PaymentsLib
 */
export class PaymentsLib {
  public async getCustomer(email: string, token: Stripe.tokens.ICardToken): Promise<Stripe.customers.ICustomer> {
    return stripe.customers.create({//create customer with card token and email
      email: email,
      source: token.id,
    }).then((customer: Stripe.customers.ICustomer) => {
        return customer;
    });
  }

  public async getToken(card: Stripe.cards.ICardSourceCreationOptionsExtended): Promise<Stripe.tokens.ICardToken> {
    return stripe.tokens.create({//create token using card details
      card,
    }).then((token: Stripe.tokens.ICardToken) => {
        return token;
    });
  }
  public async debitCharges(amount: number, custid : string): Promise<any> {
    return  stripe.charges.create({ // charge the customer
        amount,
        description: 'Sample Charges',
            currency: process.env.STRIPE_PAYMENT_CURRENCY_CODE,
            customer: custid,
        });
  }

}

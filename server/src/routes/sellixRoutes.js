import express from 'express'
import {sellixProducts, sellixWebhook} from '../controllers/sellixController.js'
const sellixRoutes = express.Router()



sellixRoutes.get('/sellix/products', sellixProducts)
sellixRoutes.post('/sellix/webhook', sellixWebhook)

export default sellixRoutes



const payload = {
    event: 'order:paid',
    data: {
      id: 1141843,
      uniqid: 'dummy',
      recurring_billing_id: null,
      type: 'PRODUCT',
      subtype: null,
      total: 0,
      total_display: 0,
      exchange_rate: 0,
      crypto_exchange_rate: 0,
      currency: 'USD',
      shop_id: 0,
      shop_image_name: null,
      shop_image_storage: null,
      cloudflare_image_id: null,
      name: null,
      customer_email: 'dummy@dummy.com',
      paypal_email_delivery: false,
      product_id: 'dummy',
      product_title: 'Dummy Product',
      product_type: 'SERIALS',
      subscription_id: null,
      subscription_time: null,
      gateway: null,
      paypal_apm: null,
      stripe_apm: null,
      paypal_email: null,
      paypal_order_id: null,
      paypal_payer_email: null,
      paypal_fee: 0,
      paypal_subscription_id: null,
      paypal_subscription_link: null,
      lex_order_id: null,
      lex_payment_method: null,
      paydash_paymentID: null,
      stripe_client_secret: null,
      stripe_price_id: null,
      skrill_email: null,
      skrill_sid: null,
      skrill_link: null,
      perfectmoney_id: null,
      binance_invoice_id: null,
      binance_qrcode: null,
      binance_checkout_url: null,
      crypto_address: null,
      crypto_amount: 0,
      crypto_received: 0,
      crypto_uri: null,
      crypto_confirmations_needed: 1,
      crypto_scheduled_payout: false,
      crypto_payout: 0,
      fee_billed: true,
      bill_info: null,
      cashapp_qrcode: null,
      cashapp_note: null,
      cashapp_cashtag: null,
      country: null,
      location: ',  ()',
      ip: null,
      is_vpn_or_proxy: false,
      user_agent: null,
      quantity: 1,
      coupon_id: null,
      custom_fields: null,
      developer_invoice: false,
      developer_title: null,
      developer_webhook: null,
      developer_return_url: null,
      status: 'VOIDED',
      status_details: null,
      void_details: null,
      discount: 0,
      fee_percentage: 0,
      day_value: 1,
      day: 'Mon',
      month: 'Jan',
      year: 2020,
      created_at: 1577836800,
      updated_at: 0,
      updated_by: 0,
      ip_info: null,
      serials: [],
      webhooks: [],
      paypal_dispute: null,
      status_history: [ [Object] ],
      crypto_transactions: [],
      gateways_available: [ '' ],
      shop_paypal_credit_card: false,
      shop_force_paypal_email_delivery: false
    }
  }
# Soudha - Week 1 Planning

## 1. Coupon Database Design

Coupon
- code
- discountType
- discountValue
- minimumPurchase
- maximumDiscount
- expiryDate
- usageLimit
- usedCount
- isActive
- createdAt
- updatedAt

## 2. Orders Database Design

Order
- user
- items
- shippingAddress
- totalAmount
- discountAmount
- finalAmount
- paymentMethod
- paymentStatus
- orderStatus
- createdAt
- updatedAt

Order Item
- product
- quantity
- price

## 3. Payment Database Design

Payment
- order
- user
- paymentMethod
- transactionId
- amount
- paymentStatus
- paidAt
- createdAt
- updatedAt

## 4. Checkout Flow Design

Customer
   ->
View Cart
   ->
Select/Enter Address
   ->
Apply Coupon
   ->
Validate Coupon
   ->
Calculate Total
   ->
Select Payment Method
   ->
Make Payment
   ->
Payment Success
   ->
Create Order
   ->
Clear Cart
   ->
Show Order Confirmation

## 5. Coupon Validation Flow

Customer enters coupon
        ->
Check coupon exists
        ->
Check active status
        ->
Check expiry date
        ->
Check minimum purchase
        ->
Check usage limit
        ->
Calculate discount
        ->
Apply discount
        ->
Update final amount

## 6. Payment Process Flow

Customer confirms checkout
        ->
Create payment request
        ->
Open Razorpay
        ->
Customer completes payment
        ->
Receive payment response
        ->
Verify payment
        ->
Payment successful?
      /       \
    Yes        No
     ↓          ↓
Create Order   Show Failure
     ↓
Clear Cart

## 7. Order Creation Flow

Checkout confirmed
        ↓
Validate cart
        ->
Validate coupon
        ->
Confirm payment
        ->
Create order
        ->
Save products, quantities and prices
        ->
Save shipping address
        ->
Save payment details
        ->
Update inventory
        ->
Clear cart
        ->
Return order confirmation
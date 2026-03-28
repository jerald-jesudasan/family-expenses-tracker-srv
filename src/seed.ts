/**
 * Seed script — run with:
 *   npx ts-node -r tsconfig-paths/register src/seed.ts
 *
 * Clears all collections and inserts realistic Indian family data.
 */

import mongoose, { Schema, model } from 'mongoose';
import * as dotenv from 'dotenv';
import * as path from 'path';
import { Logger } from '@nestjs/common';

const logger = new Logger('Seed');

dotenv.config({ path: path.resolve(__dirname, '..', '.env') });

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/family-expenses';

// ─── Minimal inline models (no NestJS decorators needed) ───────────────────

const ts = { timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' } };

const User = model('User', new Schema({}, { strict: false, ...ts }), 'users');
const Family = model('Family', new Schema({}, { strict: false, ...ts }), 'families');
const FamilyMember = model('FamilyMember', new Schema({}, { strict: false, ...ts }), 'familymembers');
const BankAccount = model('BankAccount', new Schema({}, { strict: false, ...ts }), 'bankaccounts');
const CreditCard = model('CreditCard', new Schema({}, { strict: false, ...ts }), 'creditcards');
const CreditCardBill = model('CreditCardBill', new Schema({}, { strict: false, ...ts }), 'creditcardbills');
const IncomeSource = model('IncomeSource', new Schema({}, { strict: false, ...ts }), 'incomesources');
const ExpenseCategory = model('ExpenseCategory', new Schema({}, { strict: false, ...ts }), 'expensecategories');
const IncomeRecord = model('IncomeRecord', new Schema({}, { strict: false, ...ts }), 'incomerecords');
const ExpenseRecord = model('ExpenseRecord', new Schema({}, { strict: false, ...ts }), 'expenserecords');
const Transaction = model('Transaction', new Schema({}, { strict: false, ...ts }), 'transactions');
const ScheduledPayment = model('ScheduledPayment', new Schema({}, { strict: false, ...ts }), 'scheduledpayments');
const ScheduledInstance = model('ScheduledInstance', new Schema({}, { strict: false, ...ts }), 'scheduledinstances');
const Loan = model('Loan', new Schema({}, { strict: false, ...ts }), 'loans');
const LoanPayment = model('LoanPayment', new Schema({}, { strict: false, ...ts }), 'loanpayments');
const Investment = model('Investment', new Schema({}, { strict: false, ...ts }), 'investments');
const Insurance = model('Insurance', new Schema({}, { strict: false, ...ts }), 'insurances');
const PersonalLending = model('PersonalLending', new Schema({}, { strict: false, ...ts }), 'personallendings');
const LendingPayment = model('LendingPayment', new Schema({}, { strict: false, ...ts }), 'lendingpayments');
const DocumentModel = model('DocumentModel', new Schema({}, { strict: false, ...ts }), 'documents');
const Notification = model('Notification', new Schema({}, { strict: false, ...ts }), 'notifications');

// ─── Helpers ───────────────────────────────────────────────────────────────

const id = () => new mongoose.Types.ObjectId();
const s = (oid: mongoose.Types.ObjectId) => oid.toString();

async function clearAll() {
  await Promise.all([
    User, Family, FamilyMember, BankAccount, CreditCard, CreditCardBill,
    IncomeSource, ExpenseCategory, IncomeRecord, ExpenseRecord, Transaction,
    ScheduledPayment, ScheduledInstance, Loan, LoanPayment,
    Investment, Insurance, PersonalLending, LendingPayment,
    DocumentModel, Notification,
  ].map(m => m.deleteMany({})));
  logger.log('Cleared all collections');
}

// ─── Seed ──────────────────────────────────────────────────────────────────

async function seed() {
  await mongoose.connect(MONGODB_URI);
  logger.log('Connected to MongoDB');

  await clearAll();

  // ── Users ──────────────────────────────────────────────────────────────
  const johnId = id();
  const jeraldId = id();
  const delectaId = id();

  await User.insertMany([
    {
      _id: johnId,
      email: 'jjohnclemet@yahoo.in',
      name: 'John Clemet',
      mobile: '+91 98765 43210',
      google_id: 'google_john_placeholder',
    },
    {
      _id: jeraldId,
      email: 'jjeraldjesudasan5@gmail.com',
      name: 'Jerald Jesudasan',
      mobile: '+91 98765 43211',
      google_id: 'google_jerald_placeholder',
    },
    {
      _id: delectaId,
      email: 'delectamary@gmail.com',
      name: 'Delecta Mary',
      mobile: '+91 98765 43212',
      google_id: 'google_delecta_placeholder',
    },
  ]);
  logger.log('Users');

  // ── Family ─────────────────────────────────────────────────────────────
  const familyId = id();

  await Family.create({
    _id: familyId,
    name: 'Clemet Family',
    owner_id: s(jeraldId),
    created_by: s(jeraldId),
  });

  const fam = s(familyId);
  const raj = s(jeraldId);
  const pri = s(delectaId);
  logger.log('Family');

  // ── Family Members ─────────────────────────────────────────────────────
  const memberJohnId = id();
  const memberJerldId = id();
  const memberDelectaId = id();

  await FamilyMember.insertMany([
    {
      _id: memberJerldId,
      family_id: fam, user_id: raj,
      role: 'admin', relationship: 'Self', created_by: raj,
    },
    {
      _id: memberJohnId,
      family_id: fam, user_id: s(johnId),
      role: 'member', relationship: 'Father',
      invited_by: raj, created_by: raj,
    },
    {
      _id: memberDelectaId,
      family_id: fam, user_id: pri,
      role: 'member', relationship: 'Mother',
      invited_by: raj, created_by: raj,
    },
  ]);
  logger.log('Family members');

  // ── Bank Accounts ──────────────────────────────────────────────────────
  const hdfcSavingsId = id();
  const sbiSalaryId = id();
  const iciciCurrentId = id();

  await BankAccount.insertMany([
    {
      _id: hdfcSavingsId,
      family_id: fam, bank_name: 'HDFC Bank',
      account_number: 'XXXX XXXX 4821',
      account_number_masked: '****4821',
      account_type: 'savings', balance: 145000,
      branch: 'Koramangala, Bengaluru', ifsc_code: 'HDFC0001234',
      min_balance: 10000, color: '#004C8F',
      is_primary: true, is_active: true, created_by: raj,
    },
    {
      _id: sbiSalaryId,
      family_id: fam, bank_name: 'State Bank of India',
      account_number: 'XXXX XXXX 7392',
      account_number_masked: '****7392',
      account_type: 'salary', balance: 52000,
      branch: 'MG Road, Bengaluru', ifsc_code: 'SBIN0012345',
      min_balance: 0, color: '#2D6A4F',
      is_primary: false, is_active: true, created_by: raj,
    },
    {
      _id: iciciCurrentId,
      family_id: fam, bank_name: 'ICICI Bank',
      account_number: 'XXXX XXXX 6104',
      account_number_masked: '****6104',
      account_type: 'savings', balance: 23500,
      branch: 'Indiranagar, Bengaluru', ifsc_code: 'ICIC0003456',
      min_balance: 5000, color: '#F37021',
      is_primary: false, is_active: true, created_by: pri,
    },
  ]);
  logger.log('Bank accounts');

  // ── Credit Cards ───────────────────────────────────────────────────────
  const hdfcCardId = id();
  const axisCardId = id();

  await CreditCard.insertMany([
    {
      _id: hdfcCardId,
      family_id: fam, bank_name: 'HDFC Bank',
      card_name: 'Regalia Gold',
      card_number_masked: '****  ****  ****  3847',
      credit_limit: 200000, outstanding: 45230,
      available_limit: 154770,
      billing_date: 20, due_date: 10,
      color: '#004C8F', is_active: true, created_by: raj,
    },
    {
      _id: axisCardId,
      family_id: fam, bank_name: 'Axis Bank',
      card_name: 'Magnus',
      card_number_masked: '****  ****  ****  9012',
      credit_limit: 500000, outstanding: 12800,
      available_limit: 487200,
      billing_date: 15, due_date: 5,
      color: '#800020', is_active: true, created_by: raj,
    },
  ]);
  logger.log('Credit cards');

  // ── Credit Card Bills ──────────────────────────────────────────────────
  await CreditCardBill.insertMany([
    {
      family_id: fam, card_id: s(hdfcCardId),
      year: 2026, month: 2,
      total_amount: 38420, paid_amount: 38420,
      due_date: '2026-03-10', status: 'paid', created_by: raj,
    },
    {
      family_id: fam, card_id: s(hdfcCardId),
      year: 2026, month: 3,
      total_amount: 45230, paid_amount: 0,
      due_date: '2026-04-10', status: 'unpaid', created_by: raj,
    },
    {
      family_id: fam, card_id: s(axisCardId),
      year: 2026, month: 3,
      total_amount: 12800, paid_amount: 0,
      due_date: '2026-04-05', status: 'unpaid', created_by: raj,
    },
  ]);
  logger.log('Credit card bills');

  // ── Income Sources ─────────────────────────────────────────────────────
  const rajSalarySourceId = id();
  const priyaSalarySourceId = id();
  const freelanceSourceId = id();
  const rentalSourceId = id();

  await IncomeSource.insertMany([
    {
      _id: rajSalarySourceId,
      family_id: fam, name: 'Jerald — Salary',
      description: 'Monthly salary from TechCorp Pvt Ltd',
      member_id: s(memberJerldId), amount: 120000,
      frequency: 'monthly', is_active: true, created_by: raj,
    },
    {
      _id: priyaSalarySourceId,
      family_id: fam, name: 'Delecta — Salary',
      description: 'Monthly salary from DesignHub Ltd',
      member_id: s(memberDelectaId), amount: 85000,
      frequency: 'monthly', is_active: true, created_by: raj,
    },
    {
      _id: freelanceSourceId,
      family_id: fam, name: 'Freelance Projects',
      description: 'Web development & consulting',
      member_id: s(memberJerldId), amount: 15000,
      frequency: 'monthly', is_active: true, created_by: raj,
    },
    {
      _id: rentalSourceId,
      family_id: fam, name: 'Rental Income',
      description: 'Flat in Mysuru',
      member_id: s(memberJerldId), amount: 22000,
      frequency: 'monthly', is_active: true, created_by: raj,
    },
  ]);
  logger.log('Income sources');

  // ── Expense Categories ─────────────────────────────────────────────────
  const catHousing = id();
  const catGroceries = id();
  const catUtilities = id();
  const catTransport = id();
  const catDining = id();
  const catEntertain = id();
  const catMedical = id();
  const catShopping = id();
  const catEducation = id();
  const catPersonal = id();
  const catEmi = id();

  await ExpenseCategory.insertMany([
    { _id: catHousing, family_id: fam, name: 'Housing & Rent', icon: '🏠', color: '#6366F1', is_fixed: true, is_active: true, created_by: raj },
    { _id: catGroceries, family_id: fam, name: 'Groceries', icon: '🛒', color: '#22C55E', is_fixed: false, is_active: true, created_by: raj },
    { _id: catUtilities, family_id: fam, name: 'Utilities', icon: '⚡', color: '#F59E0B', is_fixed: false, is_active: true, created_by: raj },
    { _id: catTransport, family_id: fam, name: 'Transportation', icon: '🚗', color: '#3B82F6', is_fixed: false, is_active: true, created_by: raj },
    { _id: catDining, family_id: fam, name: 'Dining Out', icon: '🍽️', color: '#EF4444', is_fixed: false, is_active: true, created_by: raj },
    { _id: catEntertain, family_id: fam, name: 'Entertainment', icon: '🎬', color: '#8B5CF6', is_fixed: false, is_active: true, created_by: raj },
    { _id: catMedical, family_id: fam, name: 'Medical', icon: '🏥', color: '#EC4899', is_fixed: false, is_active: true, created_by: raj },
    { _id: catShopping, family_id: fam, name: 'Shopping', icon: '🛍️', color: '#F97316', is_fixed: false, is_active: true, created_by: raj },
    { _id: catEducation, family_id: fam, name: 'Education', icon: '📚', color: '#06B6D4', is_fixed: false, is_active: true, created_by: raj },
    { _id: catPersonal, family_id: fam, name: 'Personal Care', icon: '💆', color: '#84CC16', is_fixed: false, is_active: true, created_by: raj },
    { _id: catEmi, family_id: fam, name: 'EMI / Loans', icon: '🏦', color: '#64748B', is_fixed: true, is_active: true, created_by: raj },
  ]);
  logger.log('Expense categories');

  // ── Income Records (Feb + Mar 2026) ────────────────────────────────────
  await IncomeRecord.insertMany([
    // February 2026
    { family_id: fam, income_source_id: s(rajSalarySourceId), year: 2026, month: 2, planned_amount: 120000, received_amount: 120000, status: 'received', created_by: raj },
    { family_id: fam, income_source_id: s(priyaSalarySourceId), year: 2026, month: 2, planned_amount: 85000, received_amount: 85000, status: 'received', created_by: raj },
    { family_id: fam, income_source_id: s(freelanceSourceId), year: 2026, month: 2, planned_amount: 15000, received_amount: 15000, status: 'received', created_by: raj },
    { family_id: fam, income_source_id: s(rentalSourceId), year: 2026, month: 2, planned_amount: 22000, received_amount: 22000, status: 'received', created_by: raj },
    // March 2026
    { family_id: fam, income_source_id: s(rajSalarySourceId), year: 2026, month: 3, planned_amount: 120000, received_amount: 120000, status: 'received', created_by: raj },
    { family_id: fam, income_source_id: s(priyaSalarySourceId), year: 2026, month: 3, planned_amount: 85000, received_amount: 85000, status: 'received', created_by: raj },
    { family_id: fam, income_source_id: s(freelanceSourceId), year: 2026, month: 3, planned_amount: 15000, received_amount: 10000, status: 'partial', created_by: raj },
    { family_id: fam, income_source_id: s(rentalSourceId), year: 2026, month: 3, planned_amount: 22000, received_amount: 22000, status: 'received', created_by: raj },
  ]);
  logger.log('Income records');

  // ── Expense Records (Feb + Mar 2026) ───────────────────────────────────
  await ExpenseRecord.insertMany([
    // February 2026 — all settled
    { family_id: fam, category_id: s(catHousing), year: 2026, month: 2, planned_amount: 35000, spent_amount: 35000, status: 'on_track', created_by: raj },
    { family_id: fam, category_id: s(catGroceries), year: 2026, month: 2, planned_amount: 12000, spent_amount: 10200, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catUtilities), year: 2026, month: 2, planned_amount: 5000, spent_amount: 4800, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catTransport), year: 2026, month: 2, planned_amount: 8000, spent_amount: 7400, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catDining), year: 2026, month: 2, planned_amount: 6000, spent_amount: 5200, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catEntertain), year: 2026, month: 2, planned_amount: 3000, spent_amount: 2100, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catMedical), year: 2026, month: 2, planned_amount: 2000, spent_amount: 3200, status: 'over', created_by: raj },
    { family_id: fam, category_id: s(catShopping), year: 2026, month: 2, planned_amount: 5000, spent_amount: 4600, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catEmi), year: 2026, month: 2, planned_amount: 65000, spent_amount: 65000, status: 'on_track', created_by: raj },
    // March 2026 — current month
    { family_id: fam, category_id: s(catHousing), year: 2026, month: 3, planned_amount: 35000, spent_amount: 35000, status: 'on_track', created_by: raj },
    { family_id: fam, category_id: s(catGroceries), year: 2026, month: 3, planned_amount: 12000, spent_amount: 8500, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catUtilities), year: 2026, month: 3, planned_amount: 5000, spent_amount: 4200, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catTransport), year: 2026, month: 3, planned_amount: 8000, spent_amount: 6300, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catDining), year: 2026, month: 3, planned_amount: 6000, spent_amount: 7800, status: 'over', created_by: raj },
    { family_id: fam, category_id: s(catEntertain), year: 2026, month: 3, planned_amount: 3000, spent_amount: 1200, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catMedical), year: 2026, month: 3, planned_amount: 2000, spent_amount: 0, status: 'under', created_by: raj },
    { family_id: fam, category_id: s(catShopping), year: 2026, month: 3, planned_amount: 5000, spent_amount: 12400, status: 'over', created_by: raj },
    { family_id: fam, category_id: s(catEducation), year: 2026, month: 3, planned_amount: 4000, spent_amount: 4000, status: 'on_track', created_by: raj },
    { family_id: fam, category_id: s(catEmi), year: 2026, month: 3, planned_amount: 65000, spent_amount: 65000, status: 'on_track', created_by: raj },
  ]);
  logger.log('Expense records');

  // ── Transactions (March 2026) ──────────────────────────────────────────
  await Transaction.insertMany([
    // Income
    { family_id: fam, type: 'income', amount: 120000, date: '2026-03-01', description: 'Jerald — March Salary', account_id: s(sbiSalaryId), income_source_id: s(rajSalarySourceId), payment_mode: 'bank', created_by: raj },
    { family_id: fam, type: 'income', amount: 85000, date: '2026-03-01', description: 'Delecta — March Salary', account_id: s(iciciCurrentId), income_source_id: s(priyaSalarySourceId), payment_mode: 'bank', created_by: pri },
    { family_id: fam, type: 'income', amount: 22000, date: '2026-03-05', description: 'Rental Income — March', account_id: s(hdfcSavingsId), income_source_id: s(rentalSourceId), payment_mode: 'bank', created_by: raj },
    { family_id: fam, type: 'income', amount: 10000, date: '2026-03-18', description: 'Freelance — Partial Mar', account_id: s(hdfcSavingsId), income_source_id: s(freelanceSourceId), payment_mode: 'bank', created_by: raj },
    // Housing
    { family_id: fam, type: 'expense', amount: 35000, date: '2026-03-01', description: 'Rent — March', account_id: s(hdfcSavingsId), category_id: s(catHousing), payment_mode: 'bank', created_by: raj },
    // Groceries
    { family_id: fam, type: 'expense', amount: 3200, date: '2026-03-04', description: 'DMart groceries', account_id: s(hdfcSavingsId), category_id: s(catGroceries), payment_mode: 'upi', created_by: pri },
    { family_id: fam, type: 'expense', amount: 2800, date: '2026-03-11', description: 'Big Basket order', account_id: s(hdfcSavingsId), category_id: s(catGroceries), payment_mode: 'card', created_by: pri },
    { family_id: fam, type: 'expense', amount: 2500, date: '2026-03-20', description: 'Weekly vegetables', account_id: s(hdfcSavingsId), category_id: s(catGroceries), payment_mode: 'cash', created_by: pri },
    // Utilities
    { family_id: fam, type: 'expense', amount: 2100, date: '2026-03-06', description: 'BESCOM electricity bill', account_id: s(hdfcSavingsId), category_id: s(catUtilities), payment_mode: 'upi', created_by: raj },
    { family_id: fam, type: 'expense', amount: 850, date: '2026-03-06', description: 'Airtel broadband bill', account_id: s(hdfcSavingsId), category_id: s(catUtilities), payment_mode: 'upi', created_by: raj },
    { family_id: fam, type: 'expense', amount: 1250, date: '2026-03-08', description: 'Gas cylinder refill', account_id: s(hdfcSavingsId), category_id: s(catUtilities), payment_mode: 'cash', created_by: pri },
    // Transport
    { family_id: fam, type: 'expense', amount: 4200, date: '2026-03-10', description: 'Petrol — March', account_id: s(hdfcSavingsId), category_id: s(catTransport), payment_mode: 'upi', created_by: raj },
    { family_id: fam, type: 'expense', amount: 2100, date: '2026-03-14', description: 'Uber — office commute', account_id: s(hdfcSavingsId), category_id: s(catTransport), payment_mode: 'upi', created_by: pri },
    // Dining
    { family_id: fam, type: 'expense', amount: 3200, date: '2026-03-08', description: 'Dinner at Meghana Foods', category_id: s(catDining), payment_mode: 'card', created_by: raj },
    { family_id: fam, type: 'expense', amount: 1400, date: '2026-03-15', description: 'Swiggy order', category_id: s(catDining), payment_mode: 'upi', created_by: pri },
    { family_id: fam, type: 'expense', amount: 3200, date: '2026-03-22', description: 'Birthday dinner', category_id: s(catDining), payment_mode: 'card', created_by: raj },
    // Entertainment
    { family_id: fam, type: 'expense', amount: 649, date: '2026-03-01', description: 'Netflix subscription', category_id: s(catEntertain), payment_mode: 'card', created_by: raj },
    { family_id: fam, type: 'expense', amount: 299, date: '2026-03-10', description: 'Amazon Prime', category_id: s(catEntertain), payment_mode: 'card', created_by: raj },
    { family_id: fam, type: 'expense', amount: 252, date: '2026-03-21', description: 'Movie tickets — PVR', category_id: s(catEntertain), payment_mode: 'upi', created_by: pri },
    // Shopping
    { family_id: fam, type: 'expense', amount: 5400, date: '2026-03-16', description: 'Myntra — ethnic wear', category_id: s(catShopping), payment_mode: 'card', created_by: pri },
    { family_id: fam, type: 'expense', amount: 4200, date: '2026-03-20', description: 'Amazon — electronics', category_id: s(catShopping), payment_mode: 'card', created_by: raj },
    { family_id: fam, type: 'expense', amount: 2800, date: '2026-03-25', description: 'IKEA — home decor', category_id: s(catShopping), payment_mode: 'card', created_by: pri },
    // Education
    { family_id: fam, type: 'expense', amount: 4000, date: '2026-03-03', description: "Jerald's school fees — Q4", category_id: s(catEducation), payment_mode: 'bank', created_by: raj },
    // EMI
    { family_id: fam, type: 'expense', amount: 32500, date: '2026-03-15', description: 'Home loan EMI — SBI', account_id: s(sbiSalaryId), category_id: s(catEmi), payment_mode: 'bank', created_by: raj },
    { family_id: fam, type: 'expense', amount: 15420, date: '2026-03-15', description: 'Car loan EMI — HDFC', account_id: s(hdfcSavingsId), category_id: s(catEmi), payment_mode: 'bank', created_by: raj },
    { family_id: fam, type: 'expense', amount: 10000, date: '2026-03-10', description: 'Axis Magnus CC bill', account_id: s(hdfcSavingsId), category_id: s(catEmi), payment_mode: 'bank', created_by: raj },
    // Transfer
    { family_id: fam, type: 'transfer', amount: 20000, date: '2026-03-03', description: 'Transfer to savings', account_id: s(sbiSalaryId), payment_mode: 'bank', created_by: raj },
  ]);
  logger.log('Transactions');

  // ── Scheduled Payments ─────────────────────────────────────────────────
  const schedHomeLoan = id();
  const schedCarLoan = id();
  const schedNetflix = id();
  const schedPrime = id();
  const schedElec = id();
  const schedLifeIns = id();
  const schedSip1 = id();
  const schedSip2 = id();

  await ScheduledPayment.insertMany([
    { _id: schedHomeLoan, family_id: fam, name: 'Home Loan EMI — SBI', category: 'emi', frequency: 'monthly', due_day: 15, amount: 32500, is_variable: false, start_date: '2022-04-01', is_active: true, created_by: raj },
    { _id: schedCarLoan, family_id: fam, name: 'Car Loan EMI — HDFC', category: 'emi', frequency: 'monthly', due_day: 15, amount: 15420, is_variable: false, start_date: '2024-01-01', end_date: '2029-01-01', is_active: true, created_by: raj },
    { _id: schedNetflix, family_id: fam, name: 'Netflix', category: 'subscription', frequency: 'monthly', due_day: 1, amount: 649, is_variable: false, start_date: '2024-06-01', is_active: true, created_by: raj },
    { _id: schedPrime, family_id: fam, name: 'Amazon Prime', category: 'subscription', frequency: 'monthly', due_day: 10, amount: 299, is_variable: false, start_date: '2024-01-01', is_active: true, created_by: raj },
    { _id: schedElec, family_id: fam, name: 'BESCOM Electricity', category: 'utility', frequency: 'monthly', due_day: 5, amount: 2100, is_variable: true, start_date: '2024-01-01', is_active: true, created_by: raj },
    { _id: schedLifeIns, family_id: fam, name: 'LIC Term Premium', category: 'insurance', frequency: 'annually', due_day: 10, due_months: [4], amount: 48000, is_variable: false, start_date: '2020-04-10', end_date: '2045-04-10', is_active: true, created_by: raj },
    { _id: schedSip1, family_id: fam, name: 'HDFC Flexi Cap SIP', category: 'investment', frequency: 'monthly', due_day: 5, amount: 10000, is_variable: false, start_date: '2023-01-05', is_active: true, created_by: raj },
    { _id: schedSip2, family_id: fam, name: 'NIFTY 50 Index Fund SIP', category: 'investment', frequency: 'monthly', due_day: 5, amount: 5000, is_variable: false, start_date: '2023-06-05', is_active: true, created_by: raj },
  ]);
  logger.log('Scheduled payments');

  // ── Scheduled Instances (Mar 2026) ─────────────────────────────────────
  await ScheduledInstance.insertMany([
    { family_id: fam, scheduled_payment_id: s(schedHomeLoan), year: 2026, month: 3, amount: 32500, due_date: '2026-03-15', status: 'paid', paid_date: '2026-03-15', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedCarLoan), year: 2026, month: 3, amount: 15420, due_date: '2026-03-15', status: 'paid', paid_date: '2026-03-15', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedNetflix), year: 2026, month: 3, amount: 649, due_date: '2026-03-01', status: 'paid', paid_date: '2026-03-01', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedPrime), year: 2026, month: 3, amount: 299, due_date: '2026-03-10', status: 'paid', paid_date: '2026-03-10', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedElec), year: 2026, month: 3, amount: 2100, due_date: '2026-03-05', status: 'paid', paid_date: '2026-03-06', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedSip1), year: 2026, month: 3, amount: 10000, due_date: '2026-03-05', status: 'paid', paid_date: '2026-03-05', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedSip2), year: 2026, month: 3, amount: 5000, due_date: '2026-03-05', status: 'paid', paid_date: '2026-03-05', created_by: raj },
    // April — upcoming
    { family_id: fam, scheduled_payment_id: s(schedHomeLoan), year: 2026, month: 4, amount: 32500, due_date: '2026-04-15', status: 'pending', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedCarLoan), year: 2026, month: 4, amount: 15420, due_date: '2026-04-15', status: 'pending', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedLifeIns), year: 2026, month: 4, amount: 48000, due_date: '2026-04-10', status: 'pending', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedSip1), year: 2026, month: 4, amount: 10000, due_date: '2026-04-05', status: 'pending', created_by: raj },
    { family_id: fam, scheduled_payment_id: s(schedSip2), year: 2026, month: 4, amount: 5000, due_date: '2026-04-05', status: 'pending', created_by: raj },
  ]);
  logger.log('Scheduled instances');

  // ── Loans ──────────────────────────────────────────────────────────────
  const homeLoanId = id();
  const carLoanId = id();

  await Loan.insertMany([
    {
      _id: homeLoanId,
      family_id: fam, name: 'SBI Home Loan',
      loan_type: 'home', lender: 'State Bank of India',
      principal_amount: 6000000, interest_rate: 8.5, tenure_months: 240,
      emi_amount: 32500, start_date: '2022-04-01',
      outstanding_balance: 5240000, total_paid: 760000,
      emi_paid_count: 48, due_day: 15,
      account_id: s(sbiSalaryId), status: 'active',
      notes: '4BHK flat — Sarjapur Road, Bengaluru',
      created_by: raj,
    },
    {
      _id: carLoanId,
      family_id: fam, name: 'HDFC Car Loan',
      loan_type: 'car', lender: 'HDFC Bank',
      principal_amount: 800000, interest_rate: 9.0, tenure_months: 60,
      emi_amount: 15420, start_date: '2024-01-01', end_date: '2029-01-01',
      outstanding_balance: 420000, total_paid: 380000,
      emi_paid_count: 27, due_day: 15,
      account_id: s(hdfcSavingsId), status: 'active',
      notes: 'Honda City 2024',
      created_by: raj,
    },
  ]);

  await LoanPayment.insertMany([
    { family_id: fam, loan_id: s(homeLoanId), amount: 32500, payment_date: '2026-02-15', principal_component: 8200, interest_component: 24300, created_by: raj },
    { family_id: fam, loan_id: s(homeLoanId), amount: 32500, payment_date: '2026-03-15', principal_component: 8270, interest_component: 24230, created_by: raj },
    { family_id: fam, loan_id: s(carLoanId), amount: 15420, payment_date: '2026-02-15', principal_component: 6320, interest_component: 9100, created_by: raj },
    { family_id: fam, loan_id: s(carLoanId), amount: 15420, payment_date: '2026-03-15', principal_component: 6368, interest_component: 9052, created_by: raj },
  ]);
  logger.log('Loans & payments');

  // ── Investments ────────────────────────────────────────────────────────
  await Investment.insertMany([
    {
      family_id: fam, name: 'HDFC Flexi Cap Fund',
      investment_type: 'mutual_fund',
      invested_amount: 360000, current_value: 418000,
      units: 12840.52, nav: 32.55,
      start_date: '2023-01-05',
      fund_house: 'HDFC AMC', folio_number: 'HDFC1234567',
      status: 'active', frequency: 'monthly', sip_amount: 10000,
      account_id: s(hdfcSavingsId),
      notes: 'Long-term wealth creation SIP',
      created_by: raj,
    },
    {
      family_id: fam, name: 'NIFTY 50 Index Fund',
      investment_type: 'mutual_fund',
      invested_amount: 165000, current_value: 192000,
      units: 5423.18, nav: 35.40,
      start_date: '2023-06-05',
      fund_house: 'UTI AMC', folio_number: 'UTI9876543',
      status: 'active', frequency: 'monthly', sip_amount: 5000,
      account_id: s(hdfcSavingsId),
      created_by: raj,
    },
    {
      family_id: fam, name: 'PPF — John',
      investment_type: 'ppf',
      invested_amount: 900000, current_value: 1080000,
      interest_rate: 7.1,
      start_date: '2017-04-01', maturity_date: '2032-04-01',
      status: 'active', frequency: 'annually',
      notes: 'Annual contribution ₹1,50,000',
      created_by: raj,
    },
    {
      family_id: fam, name: 'SBI Fixed Deposit',
      investment_type: 'fd',
      invested_amount: 500000, current_value: 535500,
      interest_rate: 7.1,
      start_date: '2025-01-15', maturity_date: '2026-07-15',
      status: 'active', frequency: 'one_time',
      account_id: s(sbiSalaryId),
      notes: '18-month FD @ 7.1% p.a.',
      created_by: raj,
    },
  ]);
  logger.log('Investments');

  // ── Insurance ──────────────────────────────────────────────────────────
  await Insurance.insertMany([
    {
      family_id: fam,
      policy_name: 'LIC Tech Term Plan',
      insurer: 'LIC of India',
      policy_number: 'LIC123456789',
      insurance_type: 'term',
      insured_member_id: s(memberJerldId),
      sum_assured: 10000000,
      premium_amount: 48000,
      premium_frequency: 'annually',
      start_date: '2020-04-10',
      maturity_date: '2045-04-10',
      next_premium_date: '2026-04-10',
      nominee: 'Delecta Mary',
      status: 'active',
      notes: '1 Crore cover till age 55',
      created_by: raj,
    },
    {
      family_id: fam,
      policy_name: 'Star Health Family Floater',
      insurer: 'Star Health Insurance',
      policy_number: 'STAR987654321',
      insurance_type: 'health',
      insured_member_id: s(memberJerldId),
      sum_assured: 1000000,
      premium_amount: 28000,
      premium_frequency: 'annually',
      start_date: '2024-07-01',
      maturity_date: '2025-07-01',
      next_premium_date: '2026-07-01',
      nominee: 'Delecta Mary',
      status: 'active',
      notes: 'Covers John, Delecta & Jerald — 10L floater',
      created_by: raj,
    },
    {
      family_id: fam,
      policy_name: 'ICICI Lombard Two-Wheeler',
      insurer: 'ICICI Lombard',
      policy_number: 'ICIC2W112233',
      insurance_type: 'vehicle',
      insured_member_id: s(memberJerldId),
      sum_assured: 80000,
      premium_amount: 3200,
      premium_frequency: 'annually',
      start_date: '2025-11-01',
      maturity_date: '2026-11-01',
      next_premium_date: '2026-11-01',
      status: 'active',
      notes: 'Honda Activa — comprehensive cover',
      created_by: raj,
    },
  ]);
  logger.log('Insurance policies');

  // ── Personal Lending ───────────────────────────────────────────────────
  const lendAmitId = id();
  const borrowDadId = id();

  await PersonalLending.insertMany([
    {
      _id: lendAmitId,
      family_id: fam, lending_type: 'lent',
      person_name: 'Amit Sharma', person_contact: '+91 99001 12233',
      amount: 50000, paid_amount: 0, outstanding_amount: 50000,
      date: '2026-03-10', due_date: '2026-06-10',
      interest_rate: 0, status: 'active',
      purpose: 'Medical emergency',
      notes: 'Old college friend — interest-free',
      created_by: raj,
    },
    {
      _id: borrowDadId,
      family_id: fam, lending_type: 'borrowed',
      person_name: 'John Clemet (Father)',
      amount: 100000, paid_amount: 25000, outstanding_amount: 75000,
      date: '2026-01-15', due_date: '2026-07-15',
      interest_rate: 0, status: 'active',
      purpose: 'Home renovation — kitchen',
      created_by: raj,
    },
  ]);

  await LendingPayment.insertMany([
    { family_id: fam, lending_id: s(borrowDadId), amount: 25000, payment_date: '2026-02-28', notes: 'First installment', created_by: raj },
  ]);
  logger.log('Personal lending & payments');

  // ── Documents ──────────────────────────────────────────────────────────
  await DocumentModel.insertMany([
    { family_id: fam, name: 'John — PAN Card', category: 'identity', member_id: raj, expiry_date: null, created_by: raj },
    { family_id: fam, name: 'Delecta — Aadhaar Card', category: 'identity', member_id: pri, expiry_date: null, created_by: raj },
    { family_id: fam, name: 'Home Loan Agreement — SBI', category: 'finance', linked_type: 'loan', linked_id: s(homeLoanId), created_by: raj },
    { family_id: fam, name: 'Star Health Policy Copy', category: 'insurance', linked_type: 'insurance', notes: 'Renewal due Jul 2026', created_by: raj },
    { family_id: fam, name: 'PPF Passbook', category: 'investment', member_id: raj, created_by: raj },
  ]);
  logger.log('Documents');

  // ── Notifications ──────────────────────────────────────────────────────
  await Notification.insertMany([
    {
      family_id: fam, user_id: raj,
      title: 'Credit Card Bill Due',
      message: 'HDFC Regalia bill of ₹45,230 is due on 10 Apr 2026.',
      type: 'reminder', priority: 'high', is_read: false,
    },
    {
      family_id: fam, user_id: raj,
      title: 'LIC Premium Due Next Month',
      message: 'LIC Tech Term premium of ₹48,000 is due on 10 Apr 2026.',
      type: 'reminder', priority: 'high', is_read: false,
    },
    {
      family_id: fam, user_id: raj,
      title: 'SFD Matures in 4 Months',
      message: 'SBI FD of ₹5,00,000 matures on 15 Jul 2026. Plan reinvestment.',
      type: 'info', priority: 'medium', is_read: false,
    },
    {
      family_id: fam, user_id: raj,
      title: 'Shopping Budget Exceeded',
      message: 'Shopping category is ₹7,400 over budget this month.',
      type: 'alert', priority: 'medium', is_read: true,
    },
    {
      family_id: fam, user_id: raj,
      title: 'Freelance Income Partial',
      message: 'Only ₹10,000 of ₹15,000 freelance income received in March.',
      type: 'info', priority: 'low', is_read: true,
    },
  ]);
  logger.log('Notifications');

  // ── Done ───────────────────────────────────────────────────────────────
  logger.log('Seed complete!');
  logger.log(`Family  : Clemet Family (${fam})`);
  logger.log(`Admin   : jjeraldjesudasan5@gmail.com (${raj})`);
  logger.log(`Member  : jjohnclemet@yahoo.in (${s(johnId)})`);
  logger.log(`Member  : delectamary@gmail.com (${pri})`);

  await mongoose.disconnect();
}

seed().catch(err => {
  logger.error('Seed failed', err);
  process.exit(1);
});

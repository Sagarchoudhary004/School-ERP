import assert from "node:assert/strict";
import test from "node:test";
import FeePayment from "../models/FeePayment.js";
import FeeStructure from "../models/FeeStructure.js";
import { calculateFeeOverview, parseComponents, statusFor } from "../controllers/feeController.js";

test("fee components are normalized and total correctly", () => {
  const components = parseComponents([
    { name: " Tuition Fee ", amount: "15000" },
    { name: "Exam Fee", amount: 5000 },
  ]);
  assert.deepEqual(components, [{ name: "Tuition Fee", amount: 15000 }, { name: "Exam Fee", amount: 5000 }]);
  assert.equal(components.reduce((sum, item) => sum + item.amount, 0), 20000);
});

test("duplicate and invalid fee components are rejected", () => {
  assert.throws(() => parseComponents([{ name: "Tuition", amount: 1 }, { name: "tuition", amount: 2 }]), /Duplicate/);
  assert.throws(() => parseComponents([{ name: "Exam", amount: -1 }]), /valid amount/);
});

test("payment status supports pending, installments, and full payment", () => {
  assert.equal(statusFor(20000, 0), "Pending");
  assert.equal(statusFor(20000, 5000), "Partially Paid");
  assert.equal(statusFor(20000, 20000), "Paid");
});

test("fee schemas enforce required production fields", () => {
  const invalidStructure = new FeeStructure({ className: "6", components: [] });
  assert.ok(invalidStructure.validateSync()?.errors.academicYear);
  assert.ok(invalidStructure.validateSync()?.errors.components);
  const invalidPayment = new FeePayment({ amountPaid: 0 });
  const errors = invalidPayment.validateSync()?.errors;
  assert.ok(errors.student && errors.feeStructure && errors.receiptNumber && errors.amountPaid);
});

test("class fee overview calculates student, paid, and pending totals", () => {
  const students = [
    { _id: "student-1", firstName: "Asha", lastName: "Roy", rollNumber: "1", studentClass: "6", section: "A" },
    { _id: "student-2", firstName: "Ravi", lastName: "Kumar", rollNumber: "2", studentClass: "6", section: "A" },
    { _id: "student-3", firstName: "Neha", lastName: "Singh", rollNumber: "1", studentClass: "7", section: "B" },
  ];
  const structures = [{ _id: "fee-6", academicYear: { name: "2026-27" }, className: "6", components: [{ name: "Tuition", amount: 20000 }], totalFee: 20000 }];
  const payments = [
    { student: "student-1", feeStructure: "fee-6", amountPaid: 5000 },
    { student: "student-1", feeStructure: "fee-6", amountPaid: 15000 },
    { student: "student-2", feeStructure: "fee-6", amountPaid: 5000 },
  ];
  const [row] = calculateFeeOverview(students, structures, payments);
  assert.equal(row.totalStudents, 2);
  assert.equal(row.studentsPaid, 2);
  assert.equal(row.fullyPaidStudents, 1);
  assert.equal(row.studentsPending, 1);
  assert.equal(row.totalAmount, 40000);
  assert.equal(row.paidAmount, 25000);
  assert.equal(row.pendingAmount, 15000);
  assert.deepEqual(row.studentDetails.map((student) => ({ name: student.studentName, paid: student.paidAmount, pending: student.pendingAmount, status: student.status })), [
    { name: "Asha Roy", paid: 20000, pending: 0, status: "Paid" },
    { name: "Ravi Kumar", paid: 5000, pending: 15000, status: "Partially Paid" },
  ]);
});

test("student fee overview includes students who have made no payment", () => {
  const [row] = calculateFeeOverview(
    [{ _id: "student-1", firstName: "No", lastName: "Payment", rollNumber: "10", studentClass: "8", section: "A" }],
    [{ _id: "fee-8", academicYear: { name: "2026-27" }, className: "8", components: [{ name: "Tuition", amount: 10000 }], totalFee: 10000 }],
    []
  );
  assert.equal(row.studentDetails.length, 1);
  assert.equal(row.studentDetails[0].paidAmount, 0);
  assert.equal(row.studentDetails[0].pendingAmount, 10000);
  assert.equal(row.studentDetails[0].status, "Pending");
  assert.equal(row.studentDetails[0].installmentCount, 0);
});

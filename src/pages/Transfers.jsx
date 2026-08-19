import React, { useState, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { base44 } from "@/api/base44Client";
import { toast } from "sonner";
import TransferForm from "@/components/transfers/TransferForm";
import TransferReview from "@/components/transfers/TransferReview";
import TransferSuccess from "@/components/transfers/TransferSuccess";

const EXCHANGE_RATE = 1250;

export default function Transfers() {
  const [step, setStep] = useState("form");
  const [tab, setTab] = useState("own");
  const [form, setForm] = useState({
    originAccountId: "",
    destinationAccountId: "",
    contactId: "",
    amount: "",
    concept: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const queryClient = useQueryClient();

  const { data: accounts = [] } = useQuery({
    queryKey: ["accounts"],
    queryFn: () => base44.entities.Account.list("-created_date"),
  });

  const { data: contacts = [] } = useQuery({
    queryKey: ["contacts"],
    queryFn: () => base44.entities.Contact.list("-created_date"),
  });

  const originAccount = accounts.find((a) => a.id === form.originAccountId);
  const destinationAccount = accounts.find((a) => a.id === form.destinationAccountId);
  const selectedContact = contacts.find((c) => c.id === form.contactId);
  const amountNum = parseFloat(form.amount) || 0;

  const validation = useMemo(() => {
    const errors = [];
    const warnings = [];

    if (!form.originAccountId) errors.push("Seleccioná una cuenta de origen");

    if (tab === "own") {
      if (!form.destinationAccountId) errors.push("Seleccioná una cuenta de destino");
      if (form.originAccountId && form.destinationAccountId && form.originAccountId === form.destinationAccountId) {
        errors.push("No podés transferir a la misma cuenta");
      }
    } else {
      if (!form.contactId) errors.push("Seleccioná un destinatario");
    }

    if (!form.amount || amountNum <= 0) errors.push("Ingresá un monto válido");
    if (originAccount && amountNum > originAccount.balance) errors.push("El monto supera el saldo disponible");

    if (tab === "own" && originAccount && destinationAccount && originAccount.currency !== destinationAccount.currency) {
      warnings.push("Las cuentas tienen distinta moneda. Se aplicará el tipo de cambio del día.");
    }

    return { errors, warnings, valid: errors.length === 0 };
  }, [form, originAccount, destinationAccount, tab, amountNum]);

  const resetAll = () => {
    setForm({ originAccountId: "", destinationAccountId: "", contactId: "", amount: "", concept: "" });
    setTab("own");
    setStep("form");
  };

  const handleConfirm = async () => {
    setSubmitting(true);
    const origin = accounts.find((a) => a.id === form.originAccountId);

    try {
      if (tab === "own") {
        const dest = accounts.find((a) => a.id === form.destinationAccountId);
        const sameCurrency = origin.currency === dest.currency;
        const destAmount = sameCurrency ? amountNum : amountNum * (origin.currency === "USD" ? EXCHANGE_RATE : 1 / EXCHANGE_RATE);

        await base44.entities.Account.update(origin.id, { balance: origin.balance - amountNum });
        await base44.entities.Account.update(dest.id, { balance: dest.balance + destAmount });

        await base44.entities.Transaction.create({
          type: "transfer_out", amount: amountNum, currency: origin.currency,
          description: form.concept || `Transferencia hacia ${dest.name}`,
          counterpart_name: dest.name, category: "otros", status: "completed", account_id: origin.id,
        });

        await base44.entities.Transaction.create({
          type: "transfer_in", amount: destAmount, currency: dest.currency,
          description: form.concept || `Transferencia desde ${origin.name}`,
          counterpart_name: origin.name, category: "otros", status: "completed", account_id: dest.id,
        });

        await base44.entities.Notification.create({
          title: "Transferencia realizada",
          message: `Transferiste ${formatCurrency(amountNum, origin.currency)} a ${dest.name}`,
          type: "transfer", amount: amountNum, currency: origin.currency, link: "/movimientos",
        });

        toast.success(`Transferencia de ${formatCurrency(amountNum, origin.currency)} realizada`);
      } else {
        const contact = contacts.find((c) => c.id === form.contactId);

        await base44.entities.Account.update(origin.id, { balance: origin.balance - amountNum });

        await base44.entities.Transaction.create({
          type: "transfer_out", amount: amountNum, currency: origin.currency,
          description: form.concept || `Transferencia a ${contact?.name || "tercero"}`,
          counterpart_name: contact?.name || "", counterpart_cuit: contact?.cuit || "",
          category: "proveedores", status: "completed", account_id: origin.id,
        });

        await base44.entities.Notification.create({
          title: "Transferencia enviada",
          message: `Enviaste ${formatCurrency(amountNum, origin.currency)} a ${contact?.name || "tercero"}`,
          type: "transfer", amount: amountNum, currency: origin.currency, link: "/movimientos",
        });

        toast.success(`Transferencia de ${formatCurrency(amountNum, origin.currency)} enviada`);
      }

      queryClient.invalidateQueries({ queryKey: ["accounts"] });
      queryClient.invalidateQueries({ queryKey: ["transactions"] });
      setStep("success");
    } catch {
      toast.error("Error al procesar la transferencia. Intentá de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  if (step === "success") {
    const destName = tab === "own" ? destinationAccount?.name : selectedContact?.name;
    return (
      <TransferSuccess
        tab={tab}
        amount={amountNum}
        currency={originAccount?.currency || "ARS"}
        originName={originAccount?.name || ""}
        destName={destName || ""}
        onNewTransfer={resetAll}
      />
    );
  }

  if (step === "review") {
    return (
      <TransferReview
        tab={tab}
        form={form}
        accounts={accounts}
        contacts={contacts}
        originAccount={originAccount}
        destinationAccount={destinationAccount}
        selectedContact={selectedContact}
        onConfirm={handleConfirm}
        onCancel={() => setStep("form")}
        submitting={submitting}
      />
    );
  }

  return (
    <TransferForm
      tab={tab}
      setTab={setTab}
      form={form}
      setForm={setForm}
      accounts={accounts}
      contacts={contacts}
      validation={validation}
      originAccount={originAccount}
      onReview={() => validation.valid && setStep("review")}
    />
  );
}

const formatCurrency = (amount, currency) => {
  const prefix = currency === "USD" ? "US$ " : "$ ";
  return `${prefix}${(amount || 0).toLocaleString("es-AR", { minimumFractionDigits: 2 })}`;
};
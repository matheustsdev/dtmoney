import {
  createContext,
  useState,
  useEffect,
  ReactNode,
  useContext,
} from "react";
import { api } from "../services/api";

interface TransactionProps {
  id: number;
  title: string;
  amount: number;
  type: "deposit" | "withdraw";
  category: string;
  createdAt: string;
}

// Type & Omit conseguem remover alguns tipos dentro de uma tipagem. Existe também o Pick,
// que seleciona quais tipos são desajados dentro de outra tipagem.
type TransactionInputProps = Omit<TransactionProps, "id" | "createdAt">;

interface TransactionsProviderProps {
  children: ReactNode;
}

interface TransactionsContentProps {
  transactions: TransactionProps[];
  createTransaction: (transaction: TransactionInputProps) => Promise<void>;
}

export const TransactionsContext = createContext<TransactionsContentProps>(
  {} as TransactionsContentProps
);

export function TransactionsProvider({ children }: TransactionsProviderProps) {
  const [transactions, setTransactions] = useState<TransactionProps[]>([]);

  async function createTransaction(transactionInput: TransactionInputProps) {
    const response = await api.post("/transactions", {
      ...transactionInput,
      createdAt: new Date(),
    });

    const { transaction } = response.data;

    setTransactions([...transactions, transaction]);
  }

  useEffect(() => {
    api
      .get("transactions")
      .then((response) => setTransactions(response.data.transactions));
  }, []);
  return (
    <TransactionsContext.Provider value={{ transactions, createTransaction }}>
      {children}
    </TransactionsContext.Provider>
  );
}
export function useTransactions() {
  const context = useContext(TransactionsContext);

  return context;
}

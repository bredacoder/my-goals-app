import { useSQLiteContext } from "expo-sqlite/next";

type TransactionCreateDatabase = {
  amount: number;
  goalId: number;
}

type TransactionResponseDatabase = {
  id: string;
  amount: number;
  goal_id: number;
  created_at: number;
}

export function useTransactionRepository() {
  const database = useSQLiteContext()

  function findLatest() {
    try {
      return database.getAllSync<TransactionResponseDatabase>(`
        SELECT * FROM transactions ORDER BY created_at DESC LIMIT 10;
      `)
    } catch (error) {
      throw error
    }
  }

  function findByGoal(goalId: number) {
    try {
      return database.getAllSync<TransactionResponseDatabase>(`
        SELECT * FROM transactions WHERE goal_id = $goalId;
      `, { $goalId: goalId })
    } catch (error) {
      throw error
    }
  }

  function create({ amount, goalId }: TransactionCreateDatabase) {
    try {
      const statement = database.prepareSync(
        "INSERT INTO transactions (amount, goal_id) VALUES ($amount, $goalId)"
      )
  
      statement.executeSync({
        $amount: amount,
        $goalId: goalId,
      })
    } catch (error) {
      throw error
    }
  }

  return {
    findLatest,
    findByGoal,
    create
  }
}
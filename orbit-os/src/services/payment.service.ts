
import { createSupabaseClient } from "@/lib/supabaseClient";
import { getSession } from "@/auth/session";

export const PaymentService = {
    async getFinanceSummary() {
        const session = await getSession();
        const supabase = createSupabaseClient(session?.accessToken);

        const { data, error } = await supabase
            .from("payments")
            .select("amount, status");

        if (error) {
            console.error("Error fetching payments:", error);
            return { total: 0, received: 0, pending: 0 };
        }

        const total = data.reduce((sum, p) => sum + Number(p.amount), 0);
        const received = data
            .filter(p => p.status === "received" || p.status === "PAID") // Handling potential case sensitivity or different status codes
            .reduce((sum, p) => sum + Number(p.amount), 0);

        return {
            total,
            received,
            pending: total - received
        };
    }
};

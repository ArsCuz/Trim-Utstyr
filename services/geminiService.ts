import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export async function generateReminderEmail(
    equipmentName: string,
    userEmail: string,
    dueDate: Date
  ): Promise<string> {
    
    // This is a placeholder for a real API key which should be stored in environment variables
    const apiKey = process.env.API_KEY;
    if (!apiKey) {
      console.error("API_KEY environment variable not set.");
      return "Error: API key is not configured. Please contact an administrator.";
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `
        Generate a polite but firm reminder email to the user with email "${userEmail}" about their overdue equipment loan from "Trim Media".
        
        Details:
        - Equipment: ${equipmentName}
        - Due Date: ${dueDate.toLocaleDateString()}
        
        The email should:
        1.  Start with a friendly but professional greeting.
        2.  Clearly state which equipment is overdue and when it was due.
        3.  Politely request its immediate return.
        4.  Provide information on how to return the equipment (e.g., "Please return it to the front desk as soon as possible.").
        5.  End with a professional closing from "The Trim Media Team".

        Format the output as a simple text email body. Do not include subject line headers or any markdown.
      `;
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
      });

      // Fix: The .text getter on GenerateContentResponse returns a string or throws.
      // The nullish coalescing operator is redundant. The catch block will handle any errors.
      return response.text;

    } catch (error) {
      console.error("Error generating reminder email:", error);
      // Fix: Safely convert the unknown error to a string for the message.
      if (error instanceof Error) {
        return `Failed to generate email. Error: ${error.message}`;
      }
      return `Failed to generate email. Error: ${String(error)}`;
    }
}

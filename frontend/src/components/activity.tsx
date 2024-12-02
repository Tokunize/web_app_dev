import { useMemo } from "react";
import { HistoricalPrice } from "./graphs/historicalGraph";
import { SmallSignUpForm } from "./property/smallSignUp";
import { useAuth0 } from "@auth0/auth0-react";


interface ActivityProps {
  property_id: number;
  data: any; // Ajusta el tipo según la estructura de `data`
}

export const Activity: React.FC<ActivityProps> = () => {
  const { isAuthenticated } = useAuth0();

  // Dummy data for property updates
  const updates = useMemo(() => [
    {
      date: "20th Oct, 2024",
      messages: [
        "New tenant moved in.",
        "First month's rent received.",
      ],
    },
    {
      date: "18th Oct, 2024",
      messages: [
        "Property renovated with new flooring.",
        "Inspection completed; all works approved.",
      ],
    },
    {
      date: "15th Oct, 2024",
      messages: [
        "Roof inspection completed successfully.",
        "Minor repairs needed on the east side.",
      ],
    },
  ], []);

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center h-[50vh]">
        <SmallSignUpForm />
      </div>
    );
  }

  return (
    <section>
      <div className="space-y-6">
        {/* Trade Volume Section */}
        <div className="bg-white py-4 border-b">
          <h4 className="text-2xl font-bold mb-2">Trade Volume</h4>
          <p className="text-gray-700 mb-2">
            The number of tokens traded over the past month. You can check the liquidity and activity level of this property.
          </p>
          <span className="text-2xl font-bold">£78,204</span>
          <span className="block text-gray-500 text-xs">Past Month</span>
          <HistoricalPrice />
        </div>

        {/* Property Updates Section */}
        <div className="bg-white py-4 border-b">
          <h4 className="text-2xl font-bold mb-4">Property Updates</h4>
          <ul className="space-y-4 text-gray-600">
            {updates.map((update, index) => (
              <li key={index}>
                <span className="font-normal text-md">{update.date}</span>
                <ul className="ml-6 space-y-1">
                  {update.messages.map((message, messageIndex) => (
                    <li key={messageIndex}>
                      {message}
                    </li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};

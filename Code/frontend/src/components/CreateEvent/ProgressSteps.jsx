const ProgressSteps = ({ steps, currentStep }) => {
  return (
    <div className="flex justify-between mb-6">
      {steps.map((step) => (
        <div key={step.id} className="flex-1 text-center">
          <div
            className={`w-10 h-10 mx-auto flex items-center justify-center rounded-full ${
              currentStep >= step.id ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-700"
            }`}
          >
            {step.id}
          </div>
          <p className="mt-2 text-sm">{step.title}</p>
        </div>
      ))}
    </div>
  );
};

export default ProgressSteps;

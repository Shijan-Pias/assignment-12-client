const Faq = () => {
  return (
    <div className="max-w-[1280px] mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-6">Frequently Asked Questions</h1>
      <p className="mb-4">Here you can find answers to common questions about our service.</p>
      <ul className="space-y-4">
        <li>
          <h3 className="font-semibold">Q: How can I order medicines?</h3>
          <p>A: You can order by selecting your medicines and adding them to cart, then checkout.</p>
        </li>
        <li>
          <h3 className="font-semibold">Q: Do I need a prescription?</h3>
          <p>A: For some medicines yes, you need to upload your doctor’s prescription.</p>
        </li>
      </ul>
    </div>
  );
};
export default Faq;

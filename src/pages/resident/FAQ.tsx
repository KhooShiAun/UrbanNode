import { useState } from "react";
import "./FAQ.css";

const faqData = [
  {
    question: "How do I submit a hazard report?",
    answer:
      "Navigate to the Create Report page and provide a clear description of the hazard you have observed. You can also pin the exact location on the map to help maintenance workers locate the issue more efficiently. Once submitted, the system will process your report and assign a severity level."
  },
  {
    question: "How can I track my reports?",
    answer:
      "You can monitor all submitted reports through the My Reports page. Each report displays its current status, assigned severity level, submission date, and SLA countdown timer. Status updates will be reflected automatically whenever maintenance workers take action."
  },
  {
    question: "What are the severity levels?",
    answer:
      "The system uses AI to classify reports into three severity levels: Low, Routine, and Urgent. Low severity refers to minor issues with little impact on public safety. Routine severity includes maintenance issues that require scheduled attention, while Urgent severity is assigned to hazards that may pose an immediate risk to public safety and require faster response times."
  },
  {
    question: "What happens if AI fails to categorize my report?",
    answer:
      "If the AI cannot determine an appropriate severity level due to unclear descriptions, spelling errors, slang, or technical issues, the report will be marked as 'Uncategorized'. These reports are flagged for manual review by authorized personnel to ensure they are still processed correctly."
  },
  {
    question: "Can I edit a report after submission?",
    answer:
      "To maintain data accuracy and accountability, submitted reports cannot be edited once they have been successfully created. If you need to provide additional information, you may submit a new report or contact the relevant city maintenance department."
  },
  {
    question: "Who can view my reports?",
    answer:
      "Your reports can only be accessed by you and authorized city maintenance workers responsible for handling infrastructure issues. This ensures that report information remains secure while allowing workers to manage and resolve reported hazards efficiently."
  },
  {
    question: "How is report priority determined?",
    answer:
      "Report priority is determined automatically by the AI Helper based on the description of the issue. The system analyzes keywords, potential safety risks, and the nature of the hazard before assigning an appropriate severity level and recommended response timeframe."
  },
  {
    question: "What does SLA mean?",
    answer:
      "SLA stands for Service Level Agreement. It represents the target response or resolution timeframe assigned to a reported issue. The SLA countdown helps both citizens and maintenance workers monitor progress and ensure that hazards are addressed within an expected period."
  },
  {
    question: "What rewards can I earn through the Community Bear system?",
    answer:
      "The Community Bear system rewards active community participation. When your submitted reports are successfully resolved, your bear avatar can unlock new accessories, equipment, and visual upgrades. These rewards serve as a representation of your contribution toward maintaining a cleaner and safer city."
  },
  {
    question: "Why is my report marked as Uncategorized?",
    answer:
      "Reports may be marked as Uncategorized when the AI cannot confidently identify the issue type or severity level. This can happen if the report contains insufficient details, unclear wording, slang, or unexpected input. Such reports are forwarded for manual review to ensure they receive proper attention."
  }
];

function FAQ() {
    const [activeIndex, setActiveIndex] = useState<number | null>(null);
    const [searchTerm, setSearchTerm] = useState("");

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

    const filteredFaqs = faqData.filter(
    (faq) =>
        faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
    );

  return (
    <div className="faq-container">
      <div className="faq-header">
        <span className="faq-badge">Support Center</span>

        <h1>Help & FAQ</h1>

        <p>
          Find answers to common questions about reporting hazards,
          tracking requests, AI-assisted categorization, and the
          Community Bear reward system.
        </p>

        <div className="faq-stats">
          <div className="stat-card">
            <h3>{faqData.length}</h3>
            <p>Frequently Asked Questions</p>
          </div>

          <div className="stat-card">
            <h3>24/7</h3>
            <p>System Availability</p>
          </div>

          <div className="stat-card">
            <h3>AI</h3>
            <p>Assisted Categorization</p>
          </div>
        </div>
      </div>

      <div className="faq-search">
        <input
        type="text"
        placeholder="Search frequently asked questions..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="faq-list">
        {filteredFaqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-card ${
              activeIndex === index ? "active" : ""
            }`}
          >
            <div
              className="faq-question"
              onClick={() => toggleFAQ(index)}
            >
              <h3>{faq.question}</h3>

              <span className="faq-icon">
                {activeIndex === index ? "−" : "+"}
              </span>
            </div>

            {activeIndex === index && (
              <div className="faq-answer">
                <p>{faq.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default FAQ;
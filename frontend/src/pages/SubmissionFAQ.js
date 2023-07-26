import React from 'react';

const FAQ = () => {
  return (
    <div className="container mt-5">
      <h1 className="mb-4">Frequently Asked Questions</h1>

      <div className="accordion" id="faqAccordion">
        <div className="accordion-item">
          <h2 className="accordion-header" id="faqHeading1">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#faqCollapse1"
              aria-expanded="true"
              aria-controls="faqCollapse1"
            >
              Question 1
            </button>
          </h2>
          <div
            id="faqCollapse1"
            className="accordion-collapse collapse show"
            aria-labelledby="faqHeading1"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Answer to question 1 goes here.
            </div>
          </div>
        </div>

        <div className="accordion-item">
          <h2 className="accordion-header" id="faqHeading2">
            <button
              className="accordion-button"
              type="button"
              data-bs-toggle="collapse"
              data-bs-target="#faqCollapse2"
              aria-expanded="false"
              aria-controls="faqCollapse2"
            >
              Question 2
            </button>
          </h2>
          <div
            id="faqCollapse2"
            className="accordion-collapse collapse"
            aria-labelledby="faqHeading2"
            data-bs-parent="#faqAccordion"
          >
            <div className="accordion-body">
              Answer to question 2 goes here.
            </div>
          </div>
        </div>

        {/* FAQ items here */}
      </div>
    </div>
  );
};

export default FAQ;

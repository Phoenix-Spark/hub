import React from 'react';
import { Col, Container, Row } from 'react-bootstrap';

const ProposalGuidelines = () => {
  return (
    <Container>
      <Row>
        <Col>
          <h1 className='mb-3'>Proposal Guidelines</h1>
          <p className='mb-5 fs-5'>
            Welcome to our proposal guidelines page! We, the team at Phoenix Sparks,
            are excited to invite you to submit your project proposal. Below are the
            guidelines for crafting a comprehensive proposal that aligns with our mission
            and goals.
          </p>

          <h2 className='mb-3'>1) Introduction:</h2>
          <ul className='mb-5 fs-5'>
            <li>Begin with a brief introduction, stating your name and affiliation (if any), and a sentence summarizing your project's purpose.</li>
						<li>Provide a context for your project by explaining the problem or opportunity you intend to address.</li>
          </ul>

          <h2 className='mb-3'>2) Project Overview:</h2>
          <ul className='mb-5 fs-5'>
            <li>Clearly describe the project's main objective and what you aim to achieve through it.</li>
						<li>Explain how your project aligns with the mission and goals of Phoenix Sparks.</li>
          </ul>

          <h2 className='mb-3'>3) Project Scope:</h2>
          <ul className='mb-5 fs-5'>
						<li>Define the scope of your project by outlining the specific activities and deliverables you plan to undertake.</li>
						<li>Set clear boundaries for what your project will and will not cover.</li>
          </ul>

          <h2 className='mb-3'>4) Methodology:</h2>
          <ul className='mb-5 fs-5'>
						<li>Describe the approach and methodology you will use to carry out the project.</li>
						<li>Explain the steps you'll take to accomplish the project's goals.</li>
						<li>If applicable, highlight any innovative or unique aspects of your approach.</li>
          </ul>

          <h2 className='mb-3'>5) Timeline:</h2>
          <ul className='mb-5 fs-5'>
						<li>Provide a breakdown of the estimated budget required for the project.</li>
						<li>Ensure the timeline is realistic and achievable within the proposed timeframe.</li>
          </ul>

          <h2 className='mb-3'>6) Budget:</h2>
          <ul className='mb-5 fs-5'>
						<li>Present a detailed timeline outlining the project's various phases, milestones, and deadlines.</li>
						<li>Be transparent about how the funds will be allocated to different project components.</li>
          </ul>

          <h2 className='mb-3'>7) Expected Outcomes:</h2>
          <ul className='mb-5 fs-5'>
						<li>Clearly articulate the anticipated outcomes and impacts of your project.</li>
						<li>Explain how these outcomes will benefit Phoenix Sparks and its stakeholders.</li>
          </ul>

          <h2 className='mb-3'>8) Evaluation and Measurement:</h2>
          <ul className='mb-5 fs-5'>
						<li>Describe the methods you will use to evaluate the success of the project.</li>
						<li>Identify specific metrics or indicators to measure progress and effectiveness.</li>
          </ul>

          <h2 className='mb-3'>9) Sustainability:</h2>
					<ul className='mb-5 fs-5'>
						<li>Discuss how the project will be sustained after its completion, emphasizing its long-term impact.</li>
						<li>If relevant, address how the project aligns with Phoenix Sparks' sustainability goals.</li>
          </ul>

          <h2 className='mb-3'>10) Partnerships and Collaboration:</h2>
          <ul className='mb-5 fs-5'>
						<li>If your project involves collaborations or partnerships, outline the key organizations or stakeholders you'll be working with and their roles.</li>
          </ul>
        </Col>
      </Row>
    </Container>
  );
}

export default ProposalGuidelines;
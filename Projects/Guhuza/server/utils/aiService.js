// server/utils/aiService.js - ENHANCED WITH 5+ SUGGESTIONS PER CATEGORY
const AI_API_URL = process.env.AI_API_URL || 'https://api-ghz-demo-v2.azurewebsites.net/api/v2/ai';
const AI_API_KEY = process.env.AI_API_KEY || '167f1e5e126eca4d980003771ba705ade86eea28da27e34b32983c0c5a18ebf8';

async function callAI(message, systemPrompt, temperature = 0.3, maxTokens = 3000) {
  try {
    const response = await fetch(`${AI_API_URL}/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': AI_API_KEY
      },
      body: JSON.stringify({
        message,
        systemPrompt,
        temperature,
        maxTokens
      })
    });

    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error || 'AI API request failed');
    }

    return data.message;
  } catch (error) {
    console.error('AI Service Error:', error);
    throw error;
  }
}

function safeParseJSON(response) {
  try {
    let cleaned = response.trim();
    cleaned = cleaned.replace(/```json/gi, '').replace(/```/g, '');
    const start = cleaned.indexOf('{');
    const end = cleaned.lastIndexOf('}');
    
    if (start !== -1 && end !== -1) {
      cleaned = cleaned.substring(start, end + 1);
    }
    
    return JSON.parse(cleaned);
  } catch (e) {
    console.error('Parse error:', e);
    return null;
  }
}

async function generateJobDescription(formData) {
  const jobTitle = formData.jobTitle || 'Professional';
  const location = formData.location || 'Location flexible';
  const workType = formData.workCondition || 'To be discussed';
  const employmentType = formData.employmentType || 'Full-time';
  
  const systemPrompt = `You are a professional job description writer. Create a job description and respond with ONLY a JSON object.

CRITICAL: You MUST provide AT LEAST 5 suggestions in EACH category (critical, recommended, niceToHave).

The JSON must have this structure:
{
  "generatedJD": {
    "title": "job title here",
    "summary": "2-3 sentences about the role",
    "responsibilities": ["task 1", "task 2", "task 3", "task 4", "task 5", "task 6"],
    "minimumQualifications": ["requirement 1", "requirement 2", "requirement 3", "requirement 4", "requirement 5"],
    "preferredQualifications": ["preferred 1", "preferred 2", "preferred 3", "preferred 4"],
    "workingConditions": "work arrangement details",
    "benefits": "benefits description"
  },
  "overallScore": 85,
  "categoryScores": {
    "jobTitle": 9,
    "roleSummary": 8,
    "reportingStructure": 7,
    "responsibilities": 8,
    "qualifications": 8,
    "companyCulture": 7,
    "benefits": 7,
    "workingConditions": 8,
    "languageClarity": 9,
    "biasCompliance": 10
  },
  "suggestions": {
    "critical": [
      {"text": "suggestion 1", "category": "jobTitle", "action": "fix", "currentText": "current", "suggestedText": "better", "reasoning": "why important"},
      {"text": "suggestion 2", "category": "responsibilities", "action": "add", "suggestedText": "add this", "reasoning": "improves clarity"},
      {"text": "suggestion 3", "category": "qualifications", "action": "fix", "currentText": "vague requirement", "suggestedText": "specific requirement", "reasoning": "increases candidate quality"},
      {"text": "suggestion 4", "category": "languageClarity", "action": "fix", "currentText": "unclear phrase", "suggestedText": "clear phrase", "reasoning": "better understanding"},
      {"text": "suggestion 5", "category": "biasCompliance", "action": "fix", "currentText": "biased term", "suggestedText": "neutral term", "reasoning": "ensures inclusivity"}
    ],
    "recommended": [
      {"text": "recommendation 1", "category": "responsibilities", "action": "add", "suggestedText": "specific task", "reasoning": "provides clarity"},
      {"text": "recommendation 2", "category": "qualifications", "action": "add", "suggestedText": "certification detail", "reasoning": "attracts qualified candidates"},
      {"text": "recommendation 3", "category": "companyCulture", "action": "add", "suggestedText": "culture info", "reasoning": "helps with cultural fit"},
      {"text": "recommendation 4", "category": "benefits", "action": "add", "suggestedText": "benefit detail", "reasoning": "increases attractiveness"},
      {"text": "recommendation 5", "category": "workingConditions", "action": "add", "suggestedText": "work detail", "reasoning": "sets clear expectations"}
    ],
    "niceToHave": [
      {"text": "nice to have 1", "category": "benefits", "action": "add", "suggestedText": "salary range", "reasoning": "transparency increases applications"},
      {"text": "nice to have 2", "category": "companyCulture", "action": "add", "suggestedText": "team size info", "reasoning": "helps candidates envision role"},
      {"text": "nice to have 3", "category": "responsibilities", "action": "add", "suggestedText": "growth opportunities", "reasoning": "attracts ambitious candidates"},
      {"text": "nice to have 4", "category": "qualifications", "action": "add", "suggestedText": "preferred certifications", "reasoning": "identifies top talent"},
      {"text": "nice to have 5", "category": "workingConditions", "action": "add", "suggestedText": "schedule flexibility", "reasoning": "improves work-life balance appeal"}
    ]
  },
  "matchabilityHints": {
    "titleClarity": "good",
    "skillsCoverage": "good",
    "locationSpecificity": "good",
    "seniorityLevel": "clear"
  }
}

REMEMBER: Provide AT LEAST 5 items in each suggestions array (critical, recommended, niceToHave).`;

  const message = `Create a professional job description for: ${jobTitle}

Location: ${location}
Work Type: ${workType}
Employment: ${employmentType}
${formData.responsibilities ? `Key Duties: ${formData.responsibilities}` : ''}
${formData.minimumRequirement ? `Must Have: ${formData.minimumRequirement}` : ''}
${formData.preferredSkills ? `Nice to Have: ${formData.preferredSkills}` : ''}

Return only the JSON object with AT LEAST 5 suggestions in each category.`;

  try {
    console.log('Generating JD for:', jobTitle);
    const response = await callAI(message, systemPrompt, 0.5, 3000);
    const parsed = safeParseJSON(response);
    
    if (parsed && parsed.generatedJD) {
      // Ensure we have at least 5 suggestions per category
      if (!parsed.suggestions.critical || parsed.suggestions.critical.length < 5) {
        parsed.suggestions = createEnhancedSuggestions(formData, parsed);
      }
      console.log('Successfully parsed AI response');
      return parsed;
    }
    
    throw new Error('Invalid response structure');
    
  } catch (error) {
    console.error('Generation failed, using fallback:', error.message);
    return createFallbackJD(formData);
  }
}

function createEnhancedSuggestions(formData, analysis) {
  const jobTitle = formData.jobTitle || 'Professional';
  
  return {
    critical: [
      {
        text: `Specify exact years of experience required for ${jobTitle} role`,
        category: 'qualifications',
        action: 'add',
        suggestedText: `3-5 years of professional experience in ${jobTitle} or related field`,
        reasoning: 'Helps candidates self-assess fit and reduces unqualified applications'
      },
      {
        text: 'Add specific technical skills or tools required',
        category: 'qualifications',
        action: 'add',
        suggestedText: 'Proficiency in [specific tools/technologies relevant to role]',
        reasoning: 'Technical specificity attracts candidates with right expertise'
      },
      {
        text: 'Include reporting structure information',
        category: 'reportingStructure',
        action: 'add',
        suggestedText: `Reports to: [Manager Title]. Works closely with: [Team/Department]`,
        reasoning: 'Clarifies organizational context and career path'
      },
      {
        text: 'Specify education requirements clearly',
        category: 'qualifications',
        action: 'add',
        suggestedText: "Bachelor's degree in [relevant field] or equivalent practical experience",
        reasoning: 'Clear education requirements filter appropriate candidates'
      },
      {
        text: 'Add measurable success metrics for the role',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'Success measured by: [specific KPIs or metrics]',
        reasoning: 'Helps candidates understand expectations and performance criteria'
      }
    ],
    recommended: [
      {
        text: 'Include information about company culture and values',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'We value collaboration, innovation, and continuous learning. Our team culture emphasizes [specific values]',
        reasoning: 'Cultural fit information improves long-term retention by 40%'
      },
      {
        text: 'Describe typical day or week in the role',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'A typical week involves: [breakdown of time allocation across different activities]',
        reasoning: 'Realistic job preview helps candidates make informed decisions'
      },
      {
        text: 'Add specific certifications that are valued',
        category: 'qualifications',
        action: 'add',
        suggestedText: 'Preferred certifications: [relevant industry certifications]',
        reasoning: 'Highlights professional development opportunities and requirements'
      },
      {
        text: 'Include information about team size and structure',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'You will join a team of [X] professionals working on [team focus]',
        reasoning: 'Team context helps candidates envision their work environment'
      },
      {
        text: 'Specify collaboration and communication expectations',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'Regular collaboration with cross-functional teams including [departments]',
        reasoning: 'Sets clear expectations for interpersonal aspects of role'
      },
      {
        text: 'Detail the interview process',
        category: 'general',
        action: 'add',
        suggestedText: 'Interview process: [number of rounds], typically completed within [timeframe]',
        reasoning: 'Transparency about process increases candidate completion rates'
      }
    ],
    niceToHave: [
      {
        text: 'Consider adding salary range for transparency',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Competitive salary range: $[X] - $[Y] based on experience and qualifications',
        reasoning: 'Salary transparency increases quality applications by 30% and reduces time-to-hire'
      },
      {
        text: 'Include details about professional development opportunities',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Professional development: Annual training budget, conference attendance, mentorship programs',
        reasoning: 'Career growth opportunities attract ambitious, long-term candidates'
      },
      {
        text: 'Describe work-life balance initiatives',
        category: 'workingConditions',
        action: 'add',
        suggestedText: 'Flexible scheduling, generous PTO policy, mental health resources, wellness programs',
        reasoning: 'Work-life balance is top priority for 78% of job seekers'
      },
      {
        text: 'Add information about diversity and inclusion initiatives',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'Committed to building diverse teams. Equal opportunity employer welcoming candidates from all backgrounds',
        reasoning: 'D&I statements increase applications from underrepresented groups by 35%'
      },
      {
        text: 'Include unique perks or benefits',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Additional perks: [e.g., remote work stipend, gym membership, team events, etc.]',
        reasoning: 'Unique benefits differentiate your company from competitors'
      },
      {
        text: 'Mention growth trajectory and promotion opportunities',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'Clear career progression path with opportunities for advancement to [senior roles]',
        reasoning: 'Career advancement potential is key factor in accepting offers'
      }
    ]
  };
}

function createFallbackJD(formData) {
  const jobTitle = formData.jobTitle || 'Professional';
  const location = formData.location || 'Various locations';
  const workType = formData.workCondition || 'Flexible';
  const employmentType = formData.employmentType || 'Full-time';
  
  const genericResponsibilities = [
    `Perform ${jobTitle.toLowerCase()} duties with high quality standards`,
    'Collaborate effectively with team members and stakeholders',
    'Contribute to project planning and execution',
    'Maintain documentation and report on progress',
    'Participate in continuous improvement initiatives',
    'Ensure compliance with company policies and procedures'
  ];
  
  const customResponsibilities = formData.responsibilities 
    ? formData.responsibilities.split(/[,.\n]/).filter(r => r.trim()).slice(0, 6)
    : genericResponsibilities;
  
  const genericQualifications = [
    'Proven experience in relevant field',
    'Strong analytical and problem-solving abilities',
    'Excellent communication skills (written and verbal)',
    'Ability to work independently and as part of a team',
    'Bachelor\'s degree or equivalent experience'
  ];
  
  const customQualifications = formData.minimumRequirement
    ? formData.minimumRequirement.split(/[,.\n]/).filter(q => q.trim()).slice(0, 5)
    : genericQualifications;
  
  const preferredSkills = formData.preferredSkills
    ? formData.preferredSkills.split(/[,.\n]/).filter(s => s.trim()).slice(0, 4)
    : [
        'Additional certifications in the field',
        'Experience with industry-standard tools',
        'Demonstrated leadership capabilities'
      ];
  
  return {
    generatedJD: {
      title: jobTitle,
      summary: `We are seeking a talented ${jobTitle} to join our dynamic team. This role offers an excellent opportunity to apply your skills and grow professionally in a supportive environment. You will work on meaningful projects that make a real impact.`,
      responsibilities: customResponsibilities.length > 0 ? customResponsibilities : genericResponsibilities,
      minimumQualifications: customQualifications.length > 0 ? customQualifications : genericQualifications,
      preferredQualifications: preferredSkills,
      workingConditions: `${workType} work arrangement. ${location}. ${employmentType} position with standard business hours. Occasional flexibility may be required based on project needs.`,
      benefits: 'We offer a competitive compensation package including health insurance, retirement plans, paid time off, professional development opportunities, and a collaborative work environment that values work-life balance.'
    },
    overallScore: 75,
    categoryScores: {
      jobTitle: 8,
      roleSummary: 7,
      reportingStructure: 6,
      responsibilities: 7,
      qualifications: 7,
      companyCulture: 6,
      benefits: 6,
      workingConditions: 7,
      languageClarity: 8,
      biasCompliance: 9
    },
    suggestions: createEnhancedSuggestions(formData, null),
    matchabilityHints: {
      titleClarity: 'good',
      skillsCoverage: 'partial - add more specific requirements',
      locationSpecificity: 'good',
      seniorityLevel: 'needs clarification - specify experience level'
    }
  };
}

async function analyzeJobDescription(jdText) {
  const systemPrompt = `You are an HR expert. Analyze the job description and return ONLY a JSON object.

CRITICAL: Provide AT LEAST 5 suggestions in EACH category (critical, recommended, niceToHave).

Structure:
{
  "overallScore": 75,
  "categoryScores": {
    "jobTitle": 8,
    "roleSummary": 7,
    "reportingStructure": 7,
    "responsibilities": 7,
    "qualifications": 7,
    "companyCulture": 6,
    "benefits": 6,
    "workingConditions": 7,
    "languageClarity": 8,
    "biasCompliance": 9
  },
  "suggestions": {
    "critical": [AT LEAST 5 critical suggestions with text, category, action, currentText, suggestedText, reasoning],
    "recommended": [AT LEAST 5 recommended suggestions],
    "niceToHave": [AT LEAST 5 nice-to-have suggestions]
  },
  "matchabilityHints": {
    "titleClarity": "good or needs_improvement",
    "skillsCoverage": "good or partial",
    "locationSpecificity": "good or needs_improvement",
    "seniorityLevel": "clear or unclear"
  },
  "summary": "Brief overall assessment"
}`;

  const message = `Analyze this job description and provide AT LEAST 5 suggestions in each category:\n\n${jdText}`;

  try {
    const response = await callAI(message, systemPrompt, 0.3, 3000);
    const parsed = safeParseJSON(response);
    
    if (parsed && parsed.overallScore) {
      // Ensure minimum 5 suggestions per category
      if (!parsed.suggestions.critical || parsed.suggestions.critical.length < 5) {
        parsed.suggestions = createAnalysisSuggestions(jdText, parsed);
      }
      return parsed;
    }
    
    throw new Error('Invalid analysis response');
    
  } catch (error) {
    console.error('Analysis failed, using enhanced fallback');
    return createEnhancedAnalysisFallback(jdText);
  }
}

function createAnalysisSuggestions(jdText, analysis) {
  const hasTitle = jdText.toLowerCase().includes('engineer') || jdText.toLowerCase().includes('manager') || jdText.toLowerCase().includes('developer');
  const hasExperience = jdText.toLowerCase().includes('year') && jdText.toLowerCase().includes('experience');
  const hasSalary = jdText.toLowerCase().includes('salary') || jdText.toLowerCase().includes('$') || jdText.toLowerCase().includes('compensation');
  const hasCulture = jdText.toLowerCase().includes('culture') || jdText.toLowerCase().includes('value') || jdText.toLowerCase().includes('mission');
  
  return {
    critical: [
      {
        text: 'Add specific years of experience required',
        category: 'qualifications',
        action: 'add',
        suggestedText: '3-5 years of relevant experience',
        reasoning: 'Experience requirements help candidates self-assess fit'
      },
      {
        text: 'Specify technical skills or certifications needed',
        category: 'qualifications',
        action: 'add',
        suggestedText: 'Required skills: [list specific technologies/tools]',
        reasoning: 'Technical specificity improves candidate quality'
      },
      {
        text: 'Include reporting structure',
        category: 'reportingStructure',
        action: 'add',
        suggestedText: 'Reports to: [Title]. Team size: [number]',
        reasoning: 'Organizational context helps candidates understand the role'
      },
      {
        text: 'Add measurable responsibilities',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'Quantify expected outcomes and success metrics',
        reasoning: 'Measurable expectations improve performance clarity'
      },
      {
        text: 'Clarify education requirements',
        category: 'qualifications',
        action: 'add',
        suggestedText: "Bachelor's degree in [field] or equivalent experience",
        reasoning: 'Clear education standards reduce mismatched applications'
      }
    ],
    recommended: [
      {
        text: 'Add company culture information',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'Describe team values, working style, and company mission',
        reasoning: 'Culture fit information increases retention by 40%'
      },
      {
        text: 'Include professional development opportunities',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Training budget, mentorship, conference attendance',
        reasoning: 'Growth opportunities attract ambitious candidates'
      },
      {
        text: 'Specify work schedule and flexibility',
        category: 'workingConditions',
        action: 'add',
        suggestedText: 'Core hours, flexibility options, remote work policy',
        reasoning: 'Schedule clarity reduces turnover'
      },
      {
        text: 'Add team collaboration details',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'Cross-functional collaboration with [departments]',
        reasoning: 'Collaboration expectations set realistic previews'
      },
      {
        text: 'Include preferred certifications',
        category: 'qualifications',
        action: 'add',
        suggestedText: 'Preferred: [industry-relevant certifications]',
        reasoning: 'Distinguishes exceptional candidates'
      },
      {
        text: 'Describe a typical day/week',
        category: 'responsibilities',
        action: 'add',
        suggestedText: 'Time breakdown: meetings, independent work, collaboration',
        reasoning: 'Realistic preview improves candidate satisfaction'
      }
    ],
    niceToHave: [
      {
        text: 'Add salary range for transparency',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Salary range: $X-$Y based on experience',
        reasoning: 'Transparency increases applications by 30%'
      },
      {
        text: 'Include diversity and inclusion statement',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'Equal opportunity employer committed to diverse teams',
        reasoning: 'D&I statements attract broader talent pool'
      },
      {
        text: 'Describe unique perks',
        category: 'benefits',
        action: 'add',
        suggestedText: 'Unique benefits: remote stipend, wellness programs, etc.',
        reasoning: 'Distinctive perks differentiate from competitors'
      },
      {
        text: 'Add career growth opportunities',
        category: 'companyCulture',
        action: 'add',
        suggestedText: 'Career path: progression to [senior roles]',
        reasoning: 'Growth trajectory attracts long-term talent'
      },
      {
        text: 'Include interview process details',
        category: 'general',
        action: 'add',
        suggestedText: 'Interview: [X] rounds over [timeframe]',
        reasoning: 'Process transparency increases completion rates'
      },
      {
        text: 'Describe work-life balance initiatives',
        category: 'workingConditions',
        action: 'add',
        suggestedText: 'PTO policy, flexible hours, mental health support',
        reasoning: 'Work-life balance is top priority for candidates'
      }
    ]
  };
}

function createEnhancedAnalysisFallback(jdText) {
  const hasTitle = jdText.toLowerCase().includes('engineer') || jdText.toLowerCase().includes('manager') || jdText.toLowerCase().includes('developer');
  const hasResponsibilities = jdText.toLowerCase().includes('responsibilities') || jdText.toLowerCase().includes('duties');
  const hasQualifications = jdText.toLowerCase().includes('qualification') || jdText.toLowerCase().includes('requirement');
  
  return {
    overallScore: hasTitle && hasResponsibilities && hasQualifications ? 70 : 60,
    categoryScores: {
      jobTitle: hasTitle ? 8 : 6,
      roleSummary: 7,
      reportingStructure: 6,
      responsibilities: hasResponsibilities ? 7 : 5,
      qualifications: hasQualifications ? 7 : 5,
      companyCulture: 6,
      benefits: 6,
      workingConditions: 6,
      languageClarity: 8,
      biasCompliance: 9
    },
    suggestions: createAnalysisSuggestions(jdText, null),
    matchabilityHints: {
      titleClarity: hasTitle ? 'good' : 'needs_improvement',
      skillsCoverage: hasQualifications ? 'partial' : 'missing',
      locationSpecificity: 'needs_improvement',
      seniorityLevel: 'unclear'
    },
    summary: 'Analysis completed. The job description covers basic elements but would benefit from more specific details about responsibilities, qualifications, compensation, and company culture to attract top candidates.'
  };
}

module.exports = {
  analyzeJobDescription,
  generateJobDescription,
  callAI
};
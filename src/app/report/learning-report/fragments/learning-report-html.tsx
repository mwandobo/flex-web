export const learningReportRenderHtml = () => {

    const columns = [
        "Output Name", "Start Date", "End Date", "Indicator Name", "Target Data",
        "Monitoring Data", "Learning Against Target (%)", "Learning Against Time"
    ];
    const data = [
        {
            name: "Output 1", start_date: "2021-01-01", end_date: "2021-12-31",
            indicators: [
                { formatted_code: "IND-001", name: "Indicator 1", target_data: "100", collected_data: "90", progress: "90%", learning_target: "80", learning_time: "On Track" },
                { formatted_code: "IND-001", name: "Indicator 1", target_data: "100", collected_data: "90", progress: "90%", learning_target: "70", learning_time: "On Track" },
                { formatted_code: "IND-001", name: "Indicator 1", target_data: "100", collected_data: "90", progress: "90%", learning_target: "100", learning_time: "On Track" }

            ],
            learning_target: "90", learning_time: "On Track"
        },
        // Add more data objects as needed
    ];

    const tableHTML = `
        <div style="padding: 16px; font-family: Arial, sans-serif;">
          <h3 style="margin-bottom: 16px;">Project Learning Report</h3>
          <div>
            <h4 style="margin-bottom: 8px;">Outputs</h4>
            <div style="overflow-x: auto;">
              <table style="width: 100%; border-collapse: collapse; margin-bottom: 16px;">
                <thead>
                  <tr style="background-color: #e5e7eb; border: 1px solid #6b7280;">
                    ${columns.map(column => `<th style="padding: 8px; text-align: left; border: 1px solid #6b7280;">${column}</th>`).join('')}
                  </tr>
                </thead>
                <tbody>
                  ${data.map(row => `
                    <tr>
                      <td style="padding: 8px; border: 1px solid #6b7280;">${row.name}</td>
                      <td style="padding: 8px; border: 1px solid #6b7280;">${row.start_date}</td>
                      <td style="padding: 8px; border: 1px solid #6b7280;">${row.end_date}</td>
                      <td colspan="3" style="padding: 8px; border: 1px solid #6b7280;">
                        ${row.indicators.map(indicator => `
                          <div style="border-bottom: 1px solid #6b7280; padding: 4px;">
                            <p>${indicator.formatted_code} - ${indicator.name}</p>
                            <p>Target: ${indicator.target_data}</p>
                            <p>Collected: ${indicator.collected_data}</p>
                            <p>Progress: ${indicator.progress}</p>
                            <p>Learning Against Target: ${indicator.learning_target}</p>
                            <p>Learning Against Time: ${indicator.learning_time}</p>
                          </div>
                        `).join('')}
                      </td>
                      <td style="padding: 8px; border: 1px solid #6b7280;">${row.learning_target}</td>
                      <td style="padding: 8px; border: 1px solid #6b7280;">${row.learning_time}</td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;

    return tableHTML;


}
import {
  Reporter,
  TestCase,
  TestResult,
  Suite,
  FullProject,
  FullResult,
} from '@playwright/test/reporter';
import * as fs from 'fs';
import * as path from 'path';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

interface TestStats {
  total: number;
  passed: number;
  failed: number;
  skipped: number;
  flaky: number;
  retries: number;
}

interface FailedTestInfo {
  title: string;
  fullTitle: string;
  error?: string;
  screenshots: string[];
  videos: string[];
  duration: number;
  retries: number;
  browser: string;
}

interface EmailReportData {
  stats: TestStats;
  failedTests: FailedTestInfo[];
  htmlReportUrl?: string;
  executionTime: number;
}

export default class EmailReporter implements Reporter {
  private reportData: EmailReportData = {
    stats: {
      total: 0,
      passed: 0,
      failed: 0,
      skipped: 0,
      flaky: 0,
      retries: 0,
    },
    failedTests: [],
    executionTime: 0,
  };

  private startTime: number = Date.now();

  onTestEnd(_test: TestCase, result: TestResult): void {
    this.reportData.stats.total += 1;

    if (result.status === 'passed') {
      this.reportData.stats.passed += 1;
    } else if (result.status === 'failed') {
      this.reportData.stats.failed += 1;

      const failedTestInfo: FailedTestInfo = {
        title: _test.title,
        fullTitle: _test.titlePath().join(' › '),
        error: result.error?.message || 'Unknown error',
        screenshots: this.extractArtifacts(result.attachments, 'image/png'),
        videos: this.extractArtifacts(result.attachments, 'video/webm'),
        duration: result.duration,
        retries: result.retry,
        browser: _test.parent?.project?.name || 'unknown',
      };

      this.reportData.failedTests.push(failedTestInfo);
    } else if (result.status === 'skipped') {
      this.reportData.stats.skipped += 1;
    }

    if (result.retry > 0) {
      this.reportData.stats.retries += 1;
    }
  }

  onEnd(result: FullResult): void {
    this.reportData.executionTime = Date.now() - this.startTime;

    // Calculate flaky tests (tests that passed but had retries)
    this.reportData.stats.flaky = this.reportData.stats.retries;

    if (process.env.SEND_EMAIL_REPORT === 'true') {
      this.sendEmailReport();
    } else {
      console.log(
        '✓ Email report feature available. Set SEND_EMAIL_REPORT=true in .env to enable.'
      );
    }

    // Always generate HTML summary locally
    this.generateLocalSummary();
  }

  private extractArtifacts(attachments: any[], mimeType: string): string[] {
    return attachments
      .filter((att) => att.contentType === mimeType)
      .map((att) => att.path || '')
      .filter((p) => p);
  }

  private async sendEmailReport(): Promise<void> {
    const smtpHost = process.env.SMTP_HOST;
    const smtpPort = parseInt(process.env.SMTP_PORT || '587', 10);
    const smtpUser = process.env.SMTP_USER;
    const smtpPassword = process.env.SMTP_PASSWORD;
    const emailFrom = process.env.EMAIL_FROM;
    const emailTo = process.env.EMAIL_TO;
    const emailSubject = process.env.EMAIL_SUBJECT || 'Playwright Test Report';

    if (!smtpHost || !smtpUser || !smtpPassword || !emailFrom || !emailTo) {
      console.error('❌ Missing email configuration. Check .env file.');
      return;
    }

    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPassword,
        },
      });

      const htmlContent = this.generateEmailHtml();
      const attachments = this.collectFailureAttachments();

      await transporter.sendMail({
        from: emailFrom,
        to: emailTo,
        subject: `${emailSubject} - ${this.reportData.stats.passed}/${this.reportData.stats.total} passed`,
        html: htmlContent,
        attachments,
      });

      console.log(`✓ Test report email sent to ${emailTo}`);
    } catch (error) {
      console.error('❌ Failed to send email report:', error);
    }
  }

  private generateEmailHtml(): string {
    const {
      stats: { total, passed, failed, skipped, flaky, retries },
      failedTests,
      executionTime,
    } = this.reportData;

    const passedPercentage = total > 0 ? Math.round((passed / total) * 100) : 0;
    const failureStatusColor = failed > 0 ? '#d32f2f' : '#388e3c';
    const formattedTime = `${Math.floor(executionTime / 1000)}s`;

    let failedTestsHtml = '';
    if (failedTests.length > 0) {
      failedTestsHtml = `
        <h2 style="color: #d32f2f; margin-top: 30px;">Failed Tests (${failed})</h2>
        <table style="width: 100%; border-collapse: collapse; margin-top: 15px;">
          <thead style="background-color: #f5f5f5;">
            <tr>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Test</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Browser</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Duration</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Retries</th>
              <th style="padding: 10px; text-align: left; border: 1px solid #ddd;">Error</th>
            </tr>
          </thead>
          <tbody>
            ${failedTests
              .map(
                (test) => `
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; font-family: monospace; font-size: 12px;">
                  ${this.escapeHtml(test.fullTitle)}
                </td>
                <td style="padding: 10px; border: 1px solid #ddd;">${test.browser}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${test.duration}ms</td>
                <td style="padding: 10px; border: 1px solid #ddd;">${test.retries}</td>
                <td style="padding: 10px; border: 1px solid #ddd;">
                  <details>
                    <summary style="cursor: pointer; color: #d32f2f;">View Error</summary>
                    <pre style="background-color: #f5f5f5; padding: 10px; margin-top: 10px; overflow-x: auto; font-size: 11px;">
${this.escapeHtml(test.error || 'No error message')}
                    </pre>
                  </details>
                </td>
              </tr>
            `
              )
              .join('')}
          </tbody>
        </table>

        <h3 style="margin-top: 20px;">Screenshots & Logs</h3>
        <ul>
          ${failedTests
            .flatMap((test) => [
              ...test.screenshots.map(
                (ss) =>
                  `<li><strong>Screenshot:</strong> <code>${this.escapeHtml(path.basename(ss))}</code></li>`
              ),
              ...test.videos.map(
                (vid) =>
                  `<li><strong>Video:</strong> <code>${this.escapeHtml(path.basename(vid))}</code></li>`
              ),
            ])
            .join('')}
        </ul>
      `;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <style>
          body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 1000px;
            margin: 0 auto;
            padding: 20px;
            background-color: #fafafa;
          }
          .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            border-radius: 8px;
            margin-bottom: 30px;
          }
          .header h1 {
            margin: 0;
            font-size: 28px;
          }
          .status-badge {
            display: inline-block;
            background-color: ${failureStatusColor};
            color: white;
            padding: 8px 16px;
            border-radius: 4px;
            font-weight: bold;
            margin-top: 10px;
          }
          .stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
          }
          .stat-card {
            background: white;
            padding: 20px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .stat-card.passed {
            border-left-color: #388e3c;
          }
          .stat-card.failed {
            border-left-color: #d32f2f;
          }
          .stat-card.skipped {
            border-left-color: #fbc02d;
          }
          .stat-value {
            font-size: 28px;
            font-weight: bold;
            color: #333;
          }
          .stat-label {
            font-size: 12px;
            color: #888;
            text-transform: uppercase;
            margin-top: 5px;
          }
          .summary {
            background: white;
            padding: 20px;
            border-radius: 8px;
            margin-bottom: 30px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          .summary p {
            margin: 10px 0;
          }
          table {
            width: 100%;
            border-collapse: collapse;
            background: white;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
          }
          th, td {
            padding: 12px;
            text-align: left;
            border: 1px solid #ddd;
          }
          th {
            background-color: #f5f5f5;
            font-weight: 600;
            color: #333;
          }
          tr:nth-child(even) {
            background-color: #fafafa;
          }
          code {
            background-color: #f5f5f5;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
          }
          pre {
            background-color: #f5f5f5;
            padding: 10px;
            border-radius: 4px;
            overflow-x: auto;
          }
          details {
            cursor: pointer;
          }
          summary {
            color: #d32f2f;
            font-weight: 500;
          }
          .footer {
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ddd;
            color: #888;
            font-size: 12px;
          }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>Playwright Test Report</h1>
          <div class="status-badge">${passed} / ${total} Tests Passed (${passedPercentage}%)</div>
        </div>

        <div class="stats">
          <div class="stat-card passed">
            <div class="stat-value">${passed}</div>
            <div class="stat-label">Passed</div>
          </div>
          <div class="stat-card failed">
            <div class="stat-value">${failed}</div>
            <div class="stat-label">Failed</div>
          </div>
          <div class="stat-card skipped">
            <div class="stat-value">${skipped}</div>
            <div class="stat-label">Skipped</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${retries}</div>
            <div class="stat-label">Retries</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">${flaky}</div>
            <div class="stat-label">Flaky</div>
          </div>
        </div>

        <div class="summary">
          <h2>Execution Summary</h2>
          <p><strong>Total Tests:</strong> ${total}</p>
          <p><strong>Execution Time:</strong> ${formattedTime}</p>
          <p><strong>Pass Rate:</strong> ${passedPercentage}%</p>
          <p><strong>Status:</strong> <strong style="color: ${failureStatusColor};">${failed > 0 ? '❌ FAILED' : '✅ PASSED'}</strong></p>
        </div>

        ${failedTestsHtml}

        <div class="footer">
          <p>Generated at ${new Date().toLocaleString()}</p>
          <p>Full HTML report: <code>test-output/report/index.html</code></p>
          <p>JSON results: <code>test-output/results/results.json</code></p>
        </div>
      </body>
      </html>
    `;
  }

  private generateLocalSummary(): void {
    const reportPath = path.join(process.cwd(), 'test-output', 'results', 'summary.json');
    fs.writeFileSync(reportPath, JSON.stringify(this.reportData, null, 2));
    console.log(`✓ Test summary saved to ${reportPath}`);
  }

  private collectFailureAttachments(): any[] {
    const attachments: any[] = [];
    const maxAttachments = 10; // Limit attachments to avoid email size limits

    this.reportData.failedTests.slice(0, 5).forEach((test) => {
      test.screenshots.slice(0, 2).forEach((screenshot) => {
        if (fs.existsSync(screenshot) && attachments.length < maxAttachments) {
          attachments.push({
            filename: `${test.title}_screenshot_${Date.now()}.png`,
            path: screenshot,
          });
        }
      });
    });

    return attachments;
  }

  private escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char]);
  }
}

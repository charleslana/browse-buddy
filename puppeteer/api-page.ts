import logger from '@electron/utils/logger';
import { ApiDetail } from './interfaces/api-detail';
import { CoreError } from './error';
import { ExecutionResult } from './interfaces/execution-result';
import { HTTPResponse, Page as PuppeteerPage } from 'puppeteer';

interface IResponse {
  url: string;
  statusCode: number;
  bodyText: string;
  bodyJson: string;
}

export class ApiPage {
  public page: PuppeteerPage = <PuppeteerPage>{};

  public async request(api: ApiDetail): Promise<ExecutionResult> {
    const startTime = Date.now();
    let duration = 0;
    let error: string | undefined;
    try {
      await this.page.setRequestInterception(true);
      this.requestData(api);
      const response = await this.page.goto(api.url);
      if (response) {
        if (response.status() !== api.expectStatusCode) {
          throw new CoreError(
            `Falha na requisição ${api.type} para ${response.url()}. Status ${response.status()}. Response ${await response.text()}`
          );
        }
        logger.info(`Sucesso na requisição ${api.type}`);
        logger.info(await this.getLog(response));
      } else {
        throw new CoreError(`Não foi possível obter resposta da requisição ${api.type}`);
      }
    } catch (e) {
      error = `Erro durante a execução da requisição ${api.type}: ${e}`;
      logger.error(error);
    } finally {
      const endTime = Date.now();
      duration = (endTime - startTime) / 1000;
      await this.page.setRequestInterception(false);
    }
    return { duration, error };
  }

  private async requestData(api: ApiDetail): Promise<void> {
    const headers: Record<string, string> = {
      Authorization: `Bearer ${api.authorization}`,
    };
    if (api.contentType === 'multipart/form-data') {
      headers['Content-Type'] = `${api.contentType}; boundary=${this.getBoundary()}`;
    } else {
      headers['Content-Type'] = api.contentType;
    }
    this.page.once('request', interceptedRequest => {
      interceptedRequest.continue({
        method: api.type,
        postData: this.getData(api),
        headers: {
          ...interceptedRequest.headers(),
          ...headers,
        },
      });
    });
  }

  private getData(api: ApiDetail): string {
    const form = new FormData();
    switch (api.contentType) {
      case 'application/json':
        return JSON.stringify(api.data);
      case 'application/x-www-form-urlencoded':
        return new URLSearchParams(api.data).toString();
      case 'multipart/form-data':
        for (const key in api.data) {
          if (Object.prototype.hasOwnProperty.call(api.data, key)) {
            form.append(key, api.data[key]);
          }
        }
        return this.formDataToMultipartString(form);
      default:
        return '';
    }
  }

  private formDataToMultipartString(formData: FormData): string {
    const boundary = `----WebKitFormBoundary${Math.random().toString().substring(2)}`;
    let multipartString = '';
    for (const [key, value] of formData.entries()) {
      multipartString += `--${boundary}\r\n`;
      multipartString += `Content-Disposition: form-data; name="${key}"\r\n\r\n`;
      multipartString += `${value}\r\n`;
    }
    multipartString += `--${boundary}--`;
    return multipartString;
  }

  private getBoundary(): string {
    return `----WebKitFormBoundary${Math.random().toString().substring(2)}`;
  }

  private async getLog(response: HTTPResponse): Promise<IResponse> {
    return {
      url: response.url(),
      statusCode: response.status(),
      bodyText: await response.text(),
      bodyJson: await response.json(),
    };
  }
}

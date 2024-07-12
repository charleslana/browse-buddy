import logger from '@electron/utils/logger';
import { CoreError } from './error';
import { HTTPResponse, Page as PuppeteerPage } from 'puppeteer';

interface IResponse {
  url: string;
  statusCode: number;
  bodyText: string;
  bodyJson: string;
}

export class ApiPage {
  public page: PuppeteerPage = <PuppeteerPage>{};

  public async post(): Promise<void> {
    try {
      await this.page.setRequestInterception(true);

      this.page.once('request', interceptedRequest => {
        interceptedRequest.continue({
          method: 'POST',
          postData: 'foo=FOO&bar=BAR',
          headers: {
            ...interceptedRequest.headers(),
            'Content-Type': 'application/x-www-form-urlencoded',
          },
        });
      });

      const response = await this.page.goto('https://postman-echo.com/post');

      if (response) {
        if (response.status() !== 200) {
          throw new CoreError(
            `Falha na requisição POST para ${response.url()}. Status ${response.status()}`
          );
        }
        logger.info('Sucesso na requisição POST');
        logger.info(await this.getLog(response));
      } else {
        throw new CoreError('Não foi possível obter resposta da requisição POST');
      }
    } catch (error) {
      logger.error('Erro durante a execução da requisição POST:', error);
    } finally {
      await this.page.setRequestInterception(false);
    }
  }

  public async get(): Promise<void> {
    try {
      await this.page.setRequestInterception(true);

      this.page.once('request', interceptedRequest => {
        interceptedRequest.continue({
          method: 'GET',
          headers: {
            ...interceptedRequest.headers(),
            'Content-Type': 'application/json',
          },
        });
      });

      const response = await this.page.goto('https://postman-echo.com/get');

      if (response) {
        if (response.status() !== 201) {
          throw new CoreError(
            `Falha na requisição GET para ${response.url()}. Status ${response.status()}`
          );
        }
        logger.info('Sucesso na requisição GET');
        logger.info(await this.getLog(response));
      } else {
        throw new CoreError('Não foi possível obter resposta da requisição GET');
      }
    } catch (error) {
      logger.error('Erro durante a execução da requisição GET:', error);
    } finally {
      await this.page.setRequestInterception(false);
    }
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

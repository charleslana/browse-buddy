export interface ApiDetail {
  url: string;
  type: 'POST' | 'PUT' | 'GET' | 'DELETE' | 'PATCH';
  data?: any;
  contentType: 'application/x-www-form-urlencoded' | 'application/json' | 'multipart/form-data';
  authorization?: string;
  expectStatusCode: number;
  saveResponseProperty?: string;
  saveScreenshot?: boolean;
}

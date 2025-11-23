import { BaseService } from './base.service';
import {
  AppsOAuth20Details,
  AppsSamlDetails,
  AppsCasDetails,
  AppsJwtDetails,
} from '@/types/entity';

// OAuth 2.0 详情服务
class AppsOAuth20DetailsService extends BaseService<AppsOAuth20Details> {
  constructor() {
    super('/apps/oauth20');
  }
}

// SAML 2.0 详情服务
class AppsSamlDetailsService extends BaseService<AppsSamlDetails> {
  constructor() {
    super('/apps/saml20');
  }
}

// CAS 详情服务
class AppsCasDetailsService extends BaseService<AppsCasDetails> {
  constructor() {
    super('/apps/cas');
  }
}

// JWT 详情服务
class AppsJwtDetailsService extends BaseService<AppsJwtDetails> {
  constructor() {
    super('/apps/jwt');
  }
}

export const appsOAuth20DetailsService = new AppsOAuth20DetailsService();
export const appsSamlDetailsService = new AppsSamlDetailsService();
export const appsCasDetailsService = new AppsCasDetailsService();
export const appsJwtDetailsService = new AppsJwtDetailsService();

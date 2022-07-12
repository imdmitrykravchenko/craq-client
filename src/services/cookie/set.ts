import { CraqService } from 'craq/src/types';
import format from 'craq/src/core/utils/cookie/format';
import { SetCookieServicePayload } from 'craq/src/core/services/cookie/types';

const setCookieService: CraqService<SetCookieServicePayload> = (
  context,
  payload,
) => {
  document.cookie = format(payload);

  return Promise.resolve();
};

export default setCookieService;

import FairShiftApp from "../components/FairShiftApp";
import { I18nProvider } from "../i18n/I18nProvider";

export default function Home() {
  return (
    <I18nProvider>
      <FairShiftApp />
    </I18nProvider>
  );
}

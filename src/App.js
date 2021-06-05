import { Container, Typography } from "@material-ui/core";
import { sortBy } from "lodash";
import moment from "moment";
import 'moment/locale/vi';
import { useEffect, useMemo, useState } from "react";
import { getCountries, getReportByCountry } from "./components/apis";
import CountrySelector from "./components/CountrySelector";
import Summary from "./components/Summary";
import Highlight from "./components/Highlight";
import '@fontsource/roboto';


moment.locale('vi');

const App = () => {
  const [countries, setCountries] = useState([]);
  const [selectedCountryId, setSelectedCountryId] = useState('');
  const [report, setReport] = useState([]);

  useEffect(() => {
    getCountries().then((res) => {
      const { data } = res;
      const countries = sortBy(data, 'Country');
      setCountries(countries);
      setSelectedCountryId('vn');
    })
  }, []);

  useEffect(() => {
    if (selectedCountryId) {
      const selectedCountry = countries.find((country) => country.ISO2 === selectedCountryId.toUpperCase());

      getReportByCountry(selectedCountry.Slug).then((res) => {
        res.data.pop();
        setReport(res.data);
      });
    }
  }, [selectedCountryId, countries]);

  const summary = useMemo(() => {
    if (report && report.length) {
      const lastedData = report[report.length - 1];
      return [
        {
          title: 'Số ca nhiễm',
          count: lastedData.Confirmed,
          type: 'confirmed',
        },
        {
          title: 'Số ca khỏi',
          count: lastedData.Recovered,
          type: 'recovered',
        },
        {
          title: 'Số ca tử vong',
          count: lastedData.Deaths,
          type: 'death',
        }
      ]
    }
    return [];
  }, [report]);

  const handleOnChange = (e) => {
    setSelectedCountryId(e.target.value);
  }


  return (
    <Container style={{ marginTop: 20 }}>
      <Typography variant='h2' component='h2'>
        Số liệu COVID-19
      </Typography>
      <Typography>{moment().format('LLL')}</Typography>
      <CountrySelector
        handleOnChange={handleOnChange}
        countries={countries}
        value={selectedCountryId}
      />
      <Highlight summary={summary} />
      <Summary countryId={selectedCountryId} report={report} />
    </Container>
  );
}

export default App;
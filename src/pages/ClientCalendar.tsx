
import { useParams } from 'react-router-dom';
import Calendar from '@/components/Calendar';

const ClientCalendar = () => {
  const { client } = useParams<{ client: string }>();
  
  return <Calendar clientId={client} />;
};

export default ClientCalendar;

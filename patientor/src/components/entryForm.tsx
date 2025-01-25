import { SyntheticEvent, useState } from 'react';
import axios from 'axios';
import { Patient } from '../types';

const EntryForm = ({
  id,
  type,
  patient,
  set,
  update,
}: {
  id: string;
  type: string;
  patient: Patient;
  set: React.Dispatch<React.SetStateAction<number>>;
  update: number;
}) => {
  const [desc, setDesc] = useState('');
  const [date, setDate] = useState('');
  const [spec, setSpec] = useState('');
  const [rate, setRate] = useState('');
  const [employerName, setEmployerName] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dischargeDate, setDischargeDate] = useState('');
  const [criteria, setCriteria] = useState('');
  const [diagnosisCodes, setDiagnosisCodes] = useState('');

  console.log(id);

  const handleSubmit = (event: SyntheticEvent) => {
    event.preventDefault();

    // Split diagnosis codes by commas and trim whitespace
    const codesArray =
      diagnosisCodes.length > 0
        ? diagnosisCodes.split(',').map((code) => code.trim())
        : undefined;

    let entry;
    switch (type) {
      case 'HealthCheck':
        entry = {
          type: 'HealthCheck',
          description: desc,
          date: date,
          specialist: spec,
          healthCheckRating: Number(rate),
          diagnosisCodes: codesArray,
        };
        break;
      case 'Occupational':
        entry = {
          type: 'OccupationalHealthcare',
          description: desc,
          date: date,
          specialist: spec,
          employerName: employerName,
          sickLeave: startDate && endDate ? { startDate, endDate } : undefined,
          diagnosisCodes: codesArray,
        };
        break;
      case 'Hospital':
        entry = {
          type: 'Hospital',
          description: desc,
          date: date,
          specialist: spec,
          discharge: {
            date: dischargeDate,
            criteria: criteria,
          },
          diagnosisCodes: codesArray,
        };
        break;
      default:
        return;
    }

    axios
      .post(`/api/patients/${id}/entries`, entry)
      .then((response) => {
        console.log(response.data);
        patient.entries.push(response.data);
        set(update + 1);

        setDesc('');
        setDate('');
        setSpec('');
        setRate('');
        setEmployerName('');
        setStartDate('');
        setEndDate('');
        setDischargeDate('');
        setCriteria('');
        setDiagnosisCodes('');
      })
      .catch((error) => alert(error));
  };

  const renderCommonFields = () => (
    <>
      <label>Description: </label>
      <input value={desc} onChange={(e) => setDesc(e.target.value)} />
      <label> Date: </label>
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
      />
      <label> Specialist: </label>
      <input value={spec} onChange={(e) => setSpec(e.target.value)} />
      <label> Diagnosis Codes (comma-separated): </label>
      <input
        value={diagnosisCodes}
        onChange={(e) => setDiagnosisCodes(e.target.value)}
      />
    </>
  );

  switch (type) {
    case 'HealthCheck':
      return (
        <fieldset style={{ border: '1px dashed' }}>
          <h4>New {type} entry</h4>
          <form onSubmit={handleSubmit}>
            {renderCommonFields()}
            <label> Healthcheck Rating: </label>
            <input
              type="number"
              min="0"
              max="3"
              value={rate}
              onChange={(e) => setRate(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </fieldset>
      );
    case 'Occupational':
      return (
        <fieldset style={{ border: '1px dashed' }}>
          <h4>New {type} entry</h4>
          <form onSubmit={handleSubmit}>
            {renderCommonFields()}
            <label> Employer Name: </label>
            <input
              value={employerName}
              onChange={(e) => setEmployerName(e.target.value)}
            />
            <label> Sick Leave Start Date: </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label> Sick Leave End Date: </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </fieldset>
      );
    case 'Hospital':
      return (
        <fieldset style={{ border: '1px dashed' }}>
          <h4>New {type} entry</h4>
          <form onSubmit={handleSubmit}>
            {renderCommonFields()}
            <label> Discharge Date: </label>
            <input
              type="date"
              value={dischargeDate}
              onChange={(e) => setDischargeDate(e.target.value)}
            />
            <label> Discharge Criteria: </label>
            <input
              value={criteria}
              onChange={(e) => setCriteria(e.target.value)}
            />
            <button type="submit">Submit</button>
          </form>
        </fieldset>
      );
    default:
      return null;
  }
};

export default EntryForm;

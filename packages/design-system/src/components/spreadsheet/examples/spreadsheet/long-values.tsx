/**
 * Rows keep their height: text never wraps, a value longer than its column ends in an ellipsis,
 * and the full text is in the cell's title. Give each column the width its usual value needs, and
 * a long list a height to scroll in under its header. The grid renders every row it is given;
 * past a few thousand cells, page the data or virtualize the rows.
 */
import { Spreadsheet } from '@wideset/react';

const clients = [
  ['Tech Nova', 'https://www.technova.com', '123 Elm St, Springfield, IL 62701'],
  ['Eco Solutions', 'https://www.ecosolutions.com', '456 Maple Ave, Denver, CO 80203'],
  ['Skyline Innovations', 'https://www.skyline.com', '789 Oak Dr, Austin, TX 73301'],
  ['Terra Firma', 'https://www.terrafirma.com', '321 Pine Rd, Seattle, WA 98101'],
  ['Quantum Leap', 'https://www.quantumleap.com', '654 Cedar Blvd, Miami, FL 33101'],
  ['Pinnacle Tech', 'https://www.pinnacletech.com', '987 Birch Ln, Portland, OR 97201'],
  ['Future Vision', 'https://www.futurevision.com', '135 Spruce Ct, Boston, MA 02101'],
  ['Sunny Tech', 'https://www.sunnytech.com', '852 Palm Blvd, Atlanta, GA 30301'],
  ['New Horizons', 'https://www.newhorizons.com', '951 Cypress Dr, Dallas, TX 75201'],
  ['Vivid Life', 'https://www.vividlife.com', '258 Walnut St, Philadelphia, PA 19101'],
  ['Synergy Works', 'https://www.synergyworks.com', '369 Chestnut Ave, Phoenix, AZ 85001'],
  ['Innovate Now', 'https://www.innovatenow.com', '147 Dogwood Ln, Orlando, FL 32801'],
];

export default function SpreadsheetLongValues() {
  return (
    <Spreadsheet aria-label="Client addresses" className="h-[14rem] w-[34rem] max-w-full">
      <Spreadsheet.Head>
        <Spreadsheet.Row>
          <Spreadsheet.ColumnHeader aria-label="Row" className="w-[2.8125rem]" />
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">Client name</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader className="w-[9.5rem]">Website</Spreadsheet.ColumnHeader>
          <Spreadsheet.ColumnHeader>Address</Spreadsheet.ColumnHeader>
        </Spreadsheet.Row>
      </Spreadsheet.Head>
      <Spreadsheet.Body>
        {clients.map(([name, website, address], index) => (
          <Spreadsheet.Row key={name}>
            <Spreadsheet.RowHeader>{index}</Spreadsheet.RowHeader>
            <Spreadsheet.Cell>{name}</Spreadsheet.Cell>
            <Spreadsheet.Cell>{website}</Spreadsheet.Cell>
            <Spreadsheet.Cell>{address}</Spreadsheet.Cell>
          </Spreadsheet.Row>
        ))}
      </Spreadsheet.Body>
    </Spreadsheet>
  );
}

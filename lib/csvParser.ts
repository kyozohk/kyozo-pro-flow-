export interface CSVMember {
  name?: string;
  firstName?: string;
  lastName?: string;
  email: string;
  phone?: string;
  bio?: string;
  rowIndex: number;
}

export interface CSVParseResult {
  members: CSVMember[];
  errors: string[];
  totalRows: number;
  validRows: number;
}

export function parseCSV(csvContent: string): CSVParseResult {
  const lines = csvContent.split('\n').filter(line => line.trim());
  const errors: string[] = [];
  const members: CSVMember[] = [];

  if (lines.length === 0) {
    return {
      members: [],
      errors: ['CSV file is empty'],
      totalRows: 0,
      validRows: 0,
    };
  }

  // Parse header row
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/"/g, ''));
  
  // Map common header variations to standard fields
  const headerMap: Record<string, string> = {};
  headers.forEach((header, index) => {
    const cleanHeader = header.toLowerCase();
    
    if (cleanHeader.includes('email') || cleanHeader.includes('e-mail')) {
      headerMap[index.toString()] = 'email';
    } else if (cleanHeader.includes('first') && cleanHeader.includes('name')) {
      headerMap[index.toString()] = 'firstName';
    } else if (cleanHeader.includes('last') && cleanHeader.includes('name')) {
      headerMap[index.toString()] = 'lastName';
    } else if (cleanHeader.includes('name') && !cleanHeader.includes('first') && !cleanHeader.includes('last')) {
      headerMap[index.toString()] = 'name';
    } else if (cleanHeader.includes('phone') || cleanHeader.includes('mobile') || cleanHeader.includes('contact')) {
      headerMap[index.toString()] = 'phone';
    } else if (cleanHeader.includes('bio') || cleanHeader.includes('description') || cleanHeader.includes('about')) {
      headerMap[index.toString()] = 'bio';
    }
  });

  // Check if we have at least an email column
  const hasEmailColumn = Object.values(headerMap).includes('email');
  if (!hasEmailColumn) {
    return {
      members: [],
      errors: ['CSV must contain an email column. Supported headers: email, e-mail, Email, E-mail'],
      totalRows: lines.length - 1,
      validRows: 0,
    };
  }

  // Parse data rows
  for (let i = 1; i < lines.length; i++) {
    const line = lines[i].trim();
    if (!line) continue;

    try {
      // Simple CSV parsing (handles basic quoted fields)
      const values = parseCSVLine(line);
      
      if (values.length !== headers.length) {
        errors.push(`Row ${i + 1}: Column count mismatch (expected ${headers.length}, got ${values.length})`);
        continue;
      }

      const member: CSVMember = {
        rowIndex: i,
        email: '', // Will be set below
      };

      // Map values to member fields
      values.forEach((value, index) => {
        const field = headerMap[index.toString()];
        if (field && value.trim()) {
          (member as any)[field] = value.trim();
        }
      });

      // Validate required fields
      if (!member.email || !member.email.includes('@')) {
        errors.push(`Row ${i + 1}: Invalid or missing email address`);
        continue;
      }

      // If no separate first/last name, try to split the name field
      if (!member.firstName && !member.lastName && member.name) {
        const nameParts = member.name.split(' ');
        member.firstName = nameParts[0];
        member.lastName = nameParts.slice(1).join(' ');
      }

      // If no name field but have first/last, combine them
      if (!member.name && (member.firstName || member.lastName)) {
        member.name = `${member.firstName || ''} ${member.lastName || ''}`.trim();
      }

      members.push(member);

    } catch (error) {
      errors.push(`Row ${i + 1}: Failed to parse - ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  return {
    members,
    errors,
    totalRows: lines.length - 1,
    validRows: members.length,
  };
}

function parseCSVLine(line: string): string[] {
  const values: string[] = [];
  let current = '';
  let inQuotes = false;
  let i = 0;

  while (i < line.length) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i += 2;
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
        i++;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      values.push(current);
      current = '';
      i++;
    } else {
      // Regular character
      current += char;
      i++;
    }
  }

  // Add the last field
  values.push(current);

  return values;
}

export function validateCSVFile(file: File): Promise<{ isValid: boolean; error?: string }> {
  return new Promise((resolve) => {
    if (!file) {
      resolve({ isValid: false, error: 'No file provided' });
      return;
    }

    if (file.type !== 'text/csv' && !file.name.toLowerCase().endsWith('.csv')) {
      resolve({ isValid: false, error: 'File must be a CSV file' });
      return;
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      resolve({ isValid: false, error: 'File size must be less than 5MB' });
      return;
    }

    resolve({ isValid: true });
  });
}

export function generateCSVTemplate(): string {
  const headers = ['Name', 'Email', 'Phone', 'Bio'];
  const sampleData = [
    ['John Doe', 'john@example.com', '+1234567890', 'Software developer and community enthusiast'],
    ['Jane Smith', 'jane@example.com', '+0987654321', 'Designer and creative thinker'],
    ['Bob Johnson', 'bob@example.com', '', 'Marketing professional'],
  ];

  const csvContent = [
    headers.join(','),
    ...sampleData.map(row => 
      row.map(cell => cell.includes(',') || cell.includes('"') ? `"${cell.replace(/"/g, '""')}"` : cell).join(',')
    )
  ].join('\n');

  return csvContent;
}

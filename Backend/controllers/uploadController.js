const ExcelJS = require('exceljs');
const Papa = require('papaparse');
const Teacher = require('../models/teacher');
const Subject = require('../models/subject');
const Room = require('../models/room');
const FixedSlot = require('../models/OP_TimeTable');

const REQUIRED_COLUMNS = {
  teachers: ['mis_id', 'name', 'email', 'designation', 'subject_preferences'],
  subjects: ['code', 'name', 'department', 'semester', 'weekly_load'],
  rooms: ['room_no', 'capacity', 'room_type', 'equipment'],
  'fixed-slots': ['division', 'day', 'period', 'teacher', 'room', 'subject'],
};

module.exports = (upload) => {
  const parseFile = async (file, fileType) => {
    if (fileType === 'xlsx') {
      const workbook = new ExcelJS.Workbook();
      await workbook.xlsx.load(file.buffer);
      const worksheet = workbook.getWorksheet(1);
      const data = [];
      const header = [];

      worksheet.getRow(1).eachCell({ includeEmpty: false }, (cell) => {
        if (cell.value) header.push(cell.value.toString().trim().toLowerCase());
      });

      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
        if (rowNumber !== 1) {
          const rowData = {};
          row.eachCell({ includeEmpty: false }, (cell, colNumber) => {
            const key = header[colNumber - 1];
            if (key) rowData[key] = cell.value;
          });
          data.push(rowData);
        }
      });

      return { header, data };
    } else if (fileType === 'csv') {
      return new Promise((resolve, reject) => {
        const content = file.buffer?.toString();
        if (!content) return reject(new Error('CSV file content is empty or unreadable.'));

        Papa.parse(content, {
          header: true,
          skipEmptyLines: true,
          complete: (results) => {
            const header = results.meta.fields.map(h => h.trim().toLowerCase());
            resolve({ header, data: results.data });
          },
          error: (err) => reject(err),
        });
      });
    } else {
      throw new Error('Unsupported file type');
    }
  };

  const validateHeaders = (actualHeaders, requiredHeaders) => {
    const normalized = actualHeaders.map(h => h.trim().toLowerCase());
    const missing = requiredHeaders.filter(col => !normalized.includes(col.toLowerCase()));

    if (missing.length > 0) {
      throw new Error(`Missing required fields: ${missing.join(', ')}`);
    }
  };

  const extractExtension = (filename = '') => filename.split('.').pop()?.toLowerCase();

  const handleUpload = (model, requiredCols, fieldName, fileLabel) => [
    upload.single(fieldName),
    async (req, res) => {
      try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const ext = extractExtension(req.file.originalname);
        const { header, data } = await parseFile(req.file, ext);
        validateHeaders(header, requiredCols);

        if (fileLabel === 'Teachers') {
          data.forEach(t => {
            if (typeof t.subject_preferences === 'string') {
              t.subject_preferences = t.subject_preferences.split(',').map(s => s.trim());
            }
            // Add this block to handle email field if it's an object (e.g., from Excel hyperlink)
            if (typeof t.email === 'object' && t.email !== null && t.email.text) {
              t.email = t.email.text;
            }
          });
        }

        if (fileLabel === 'Rooms') {
          data.forEach(r => {
            if (typeof r.equipment === 'string') {
              r.equipment = r.equipment.split(',').map(e => e.trim());
            }
          });
        }

        const identifierField = {
          Teachers: 'mis_id',
          Subjects: 'code',
          Rooms: 'room_no',
          'Fixed Slots': ['division', 'day', 'period'],
        };

        for (const record of data) {
          const filter =
            fileLabel === 'Fixed Slots'
              ? {
                  division: record.division,
                  day: record.day,
                  period: record.period,
                }
              : { [identifierField[fileLabel]]: record[identifierField[fileLabel]] };

          await model.updateOne(filter, { $set: record }, { upsert: true });
        }

        res.status(200).json({ message: `${fileLabel} uploaded successfully with upsert!` });
      } catch (error) {
        console.error(`${fileLabel} Upload Error:`, error.stack);
        res.status(500).json({ error: error.message || 'Upload failed' });
      }
    },
  ];

  return {
    uploadTeachers: handleUpload(Teacher, REQUIRED_COLUMNS.teachers, 'teachersFile', 'Teachers'),
    uploadSubjects: handleUpload(Subject, REQUIRED_COLUMNS.subjects, 'subjectsFile', 'Subjects'),
    uploadRooms: handleUpload(Room, REQUIRED_COLUMNS.rooms, 'roomsFile', 'Rooms'),
    uploadFixedSlots: handleUpload(
      FixedSlot,
      REQUIRED_COLUMNS['fixed-slots'],
      'fixedSlotFile',
      'Fixed Slots'
    ),
  };
};

export interface SQLQueryResult {
  columns: string[];
  rows: string[][];
  rowCount: number;
  executionTimeMs: number;
  error: string | null;
}

export interface MockDatabaseTables {
  customers: Array<{
    customer_id: number;
    customer_name: string;
    email: string;
    city: string;
    country: string;
    tier: 'Bronze' | 'Silver' | 'Gold';
  }>;
  orders: Array<{
    order_id: number;
    customer_id: number;
    product_id: number;
    order_date: string;
    quantity: number;
    amount: number;
    status: 'Completed' | 'Pending' | 'Cancelled';
  }>;
  products: Array<{
    product_id: number;
    product_name: string;
    category: string;
    price: number;
    stock: number;
  }>;
  employees: Array<{
    employee_id: number;
    first_name: string;
    last_name: string;
    department: string;
    salary: number;
    hire_year: number;
  }>;
  sales: Array<{
    sale_id: number;
    region: string;
    rep_name: string;
    amount: number;
    sale_date: string;
  }>;
}

// Realistic Relational Mock Database Tables
export const MOCK_DATABASE_TABLES: MockDatabaseTables = {
  customers: [
    { customer_id: 1, customer_name: 'Alice Johnson', email: 'alice@example.com', city: 'New York', country: 'USA', tier: 'Gold' },
    { customer_id: 2, customer_name: 'Bob Smith', email: 'bob@example.com', city: 'London', country: 'UK', tier: 'Silver' },
    { customer_id: 3, customer_name: 'Carol White', email: 'carol@example.com', city: 'Toronto', country: 'Canada', tier: 'Gold' },
    { customer_id: 4, customer_name: 'David Lee', email: 'david@example.com', city: 'Sydney', country: 'Australia', tier: 'Bronze' },
    { customer_id: 5, customer_name: 'Eva Green', email: 'eva@example.com', city: 'Berlin', country: 'Germany', tier: 'Silver' },
    { customer_id: 6, customer_name: 'Frank Miller', email: 'frank@example.com', city: 'Chicago', country: 'USA', tier: 'Bronze' },
  ],
  orders: [
    { order_id: 101, customer_id: 1, product_id: 201, order_date: '2024-01-15', quantity: 1, amount: 1200, status: 'Completed' },
    { order_id: 102, customer_id: 2, product_id: 202, order_date: '2024-01-18', quantity: 2, amount: 600, status: 'Completed' },
    { order_id: 103, customer_id: 1, product_id: 203, order_date: '2024-01-20', quantity: 1, amount: 80, status: 'Completed' },
    { order_id: 104, customer_id: 4, product_id: 201, order_date: '2024-02-01', quantity: 1, amount: 1200, status: 'Pending' },
    { order_id: 105, customer_id: 3, product_id: 204, order_date: '2024-02-05', quantity: 3, amount: 135, status: 'Completed' },
    { order_id: 106, customer_id: 5, product_id: 205, order_date: '2024-02-12', quantity: 1, amount: 450, status: 'Completed' },
    { order_id: 107, customer_id: 2, product_id: 206, order_date: '2024-02-14', quantity: 2, amount: 440, status: 'Cancelled' },
    { order_id: 108, customer_id: 6, product_id: 202, order_date: '2024-02-20', quantity: 1, amount: 350, status: 'Completed' },
  ],
  products: [
    { product_id: 201, product_name: 'Pro Laptop 15', category: 'Computers', price: 1200, stock: 15 },
    { product_id: 202, product_name: '4K Ultra Monitor', category: 'Displays', price: 350, stock: 28 },
    { product_id: 203, product_name: 'Mechanical Keyboard', category: 'Accessories', price: 80, stock: 50 },
    { product_id: 204, product_name: 'Wireless Mouse', category: 'Accessories', price: 45, stock: 85 },
    { product_id: 205, product_name: 'Ergonomic Desk', category: 'Furniture', price: 450, stock: 12 },
    { product_id: 206, product_name: 'Office Chair', category: 'Furniture', price: 220, stock: 20 },
  ],
  employees: [
    { employee_id: 1, first_name: 'Sarah', last_name: 'Connor', department: 'Analytics', salary: 95000, hire_year: 2020 },
    { employee_id: 2, first_name: 'John', last_name: 'Doe', department: 'Sales', salary: 65000, hire_year: 2021 },
    { employee_id: 3, first_name: 'Emily', last_name: 'Blunt', department: 'Analytics', salary: 105000, hire_year: 2019 },
    { employee_id: 4, first_name: 'Michael', last_name: 'Scott', department: 'Sales', salary: 78000, hire_year: 2018 },
    { employee_id: 5, first_name: 'Pam', last_name: 'Beesly', department: 'Operations', salary: 58000, hire_year: 2022 },
    { employee_id: 6, first_name: 'Jim', last_name: 'Halpert', department: 'Sales', salary: 82000, hire_year: 2019 },
  ],
  sales: [
    { sale_id: 1, region: 'East', rep_name: 'John Doe', amount: 15200, sale_date: '2024-01-10' },
    { sale_id: 2, region: 'West', rep_name: 'Jim Halpert', amount: 22400, sale_date: '2024-01-12' },
    { sale_id: 3, region: 'North', rep_name: 'Michael Scott', amount: 18500, sale_date: '2024-01-15' },
    { sale_id: 4, region: 'East', rep_name: 'John Doe', amount: 9800, sale_date: '2024-02-01' },
    { sale_id: 5, region: 'South', rep_name: 'Dwight Schrute', amount: 31000, sale_date: '2024-02-04' },
    { sale_id: 6, region: 'West', rep_name: 'Jim Halpert', amount: 14500, sale_date: '2024-02-18' },
    { sale_id: 7, region: 'East', rep_name: 'John Doe', amount: 12100, sale_date: '2024-02-25' },
  ],
};

type GenericRow = Record<string, any>;

/**
 * Executes a SQL SELECT statement in-memory against local mock datasets.
 * Supports: SELECT, WHERE, DISTINCT, ORDER BY, LIMIT, GROUP BY, HAVING,
 * COUNT, SUM, AVG, MIN, MAX, INNER JOIN, LEFT JOIN, CASE WHEN, and column aliases.
 */
export const executeSQLQuery = (rawQuery: string): SQLQueryResult => {
  const startTime = performance.now();
  if (!rawQuery || typeof rawQuery !== 'string' || !rawQuery.trim()) {
    return { columns: [], rows: [], rowCount: 0, executionTimeMs: 0, error: 'Empty query provided.' };
  }

  try {
    // Strip comments and trailing semicolons
    const cleanQuery = rawQuery
      .replace(/--.*$/gm, '')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .trim()
      .replace(/;+\s*$/, '');

    // Basic syntax check: must start with SELECT
    if (!/^\s*SELECT\b/i.test(cleanQuery)) {
      throw new Error('Only SELECT queries are supported in this local sandbox environment.');
    }

    // Extract clauses using regexes with lookaheads
    const selectMatch = cleanQuery.match(/^\s*SELECT\s+(DISTINCT\s+)?([\s\S]+?)\s+FROM\s+/i);
    if (!selectMatch) {
      throw new Error('Malformed SELECT query. Ensure syntax: SELECT <columns> FROM <table> [WHERE ...]');
    }

    const isDistinct = Boolean(selectMatch[1]);
    const selectColsRaw = selectMatch[2].trim();

    // Remainder starting with FROM
    const fromIndex = selectMatch[0].length - 'FROM '.length;

    // Parse clauses
    const clauseRegex = /\b(FROM|LEFT\s+OUTER\s+JOIN|LEFT\s+JOIN|INNER\s+JOIN|JOIN|WHERE|GROUP\s+BY|HAVING|ORDER\s+BY|LIMIT)\b/gi;
    const matches: Array<{ keyword: string; index: number; length: number }> = [];
    let m: RegExpExecArray | null;
    while ((m = clauseRegex.exec(cleanQuery)) !== null) {
      if (m.index >= fromIndex) {
        matches.push({ keyword: m[1].toUpperCase().replace(/\s+/g, ' '), index: m.index, length: m[0].length });
      }
    }

    const clauses: Record<string, string> = {};
    const joins: Array<{ type: string; content: string }> = [];

    for (let i = 0; i < matches.length; i++) {
      const current = matches[i];
      const start = current.index + current.length;
      const end = i + 1 < matches.length ? matches[i + 1].index : cleanQuery.length;
      const content = cleanQuery.slice(start, end).trim();

      if (current.keyword === 'FROM') {
        clauses.from = content;
      } else if (current.keyword.includes('JOIN')) {
        joins.push({ type: current.keyword, content });
      } else if (current.keyword === 'WHERE') {
        clauses.where = content;
      } else if (current.keyword === 'GROUP BY') {
        clauses.groupBy = content;
      } else if (current.keyword === 'HAVING') {
        clauses.having = content;
      } else if (current.keyword === 'ORDER BY') {
        clauses.orderBy = content;
      } else if (current.keyword === 'LIMIT') {
        clauses.limit = content;
      }
    }

    // 1. Resolve FROM table
    if (!clauses.from) {
      throw new Error('Missing FROM clause.');
    }

    const fromParts = clauses.from.trim().split(/\s+(?:AS\s+)?/i);
    const mainTableName = fromParts[0].toLowerCase() as keyof MockDatabaseTables;
    const mainTableAlias = fromParts[1] ? fromParts[1].toLowerCase() : mainTableName;

    if (!MOCK_DATABASE_TABLES[mainTableName]) {
      const available = Object.keys(MOCK_DATABASE_TABLES).join(', ');
      throw new Error(`Table "${mainTableName}" not found. Available tables: ${available}`);
    }

    // Create unified records with prefix/aliases
    let records: GenericRow[] = (MOCK_DATABASE_TABLES[mainTableName] as GenericRow[]).map((row) => {
      const rec: GenericRow = {};
      for (const [k, v] of Object.entries(row)) {
        rec[k.toLowerCase()] = v;
        rec[`${mainTableAlias}.${k.toLowerCase()}`] = v;
        rec[`${mainTableName}.${k.toLowerCase()}`] = v;
      }
      return rec;
    });

    // 2. Resolve JOINs
    for (const join of joins) {
      const onMatch = join.content.match(/^([a-z0-9_]+)(?:\s+(?:AS\s+)?([a-z0-9_]+))?\s+ON\s+([a-z0-9_.]+)\s*=\s*([a-z0-9_.]+)/i);
      if (!onMatch) {
        throw new Error(`Malformed JOIN clause near: "${join.content}". Expected format: JOIN <table> [alias] ON <col1> = <col2>`);
      }

      const joinTable = onMatch[1].toLowerCase() as keyof MockDatabaseTables;
      const joinAlias = onMatch[2] ? onMatch[2].toLowerCase() : joinTable;
      const leftKey = onMatch[3].toLowerCase();
      const rightKey = onMatch[4].toLowerCase();

      if (!MOCK_DATABASE_TABLES[joinTable]) {
        throw new Error(`Joined table "${joinTable}" not found.`);
      }

      const isLeft = join.type.includes('LEFT');
      const joinedRecords: GenericRow[] = [];

      for (const leftRow of records) {
        const leftVal = leftRow[leftKey];
        let matched = false;

        for (const rightRow of MOCK_DATABASE_TABLES[joinTable] as GenericRow[]) {
          const rightRowPrepared: GenericRow = {};
          for (const [k, v] of Object.entries(rightRow)) {
            rightRowPrepared[k.toLowerCase()] = v;
            rightRowPrepared[`${joinAlias}.${k.toLowerCase()}`] = v;
            rightRowPrepared[`${joinTable}.${k.toLowerCase()}`] = v;
          }

          const rightVal = rightRowPrepared[rightKey];
          if (leftVal !== undefined && rightVal !== undefined && String(leftVal) === String(rightVal)) {
            joinedRecords.push({ ...leftRow, ...rightRowPrepared });
            matched = true;
          }
        }

        if (!matched && isLeft) {
          const nullCols: GenericRow = {};
          const sample = (MOCK_DATABASE_TABLES[joinTable] as GenericRow[])[0] || {};
          for (const k of Object.keys(sample)) {
            nullCols[k.toLowerCase()] = null;
            nullCols[`${joinAlias}.${k.toLowerCase()}`] = null;
            nullCols[`${joinTable}.${k.toLowerCase()}`] = null;
          }
          joinedRecords.push({ ...leftRow, ...nullCols });
        }
      }

      records = joinedRecords;
    }

    // Helper: evaluate value for a row
    const evalExpr = (expr: string, row?: GenericRow): any => {
      const trimmed = expr.trim();
      // Literal number
      if (/^-?\d+(\.\d+)?$/.test(trimmed)) return Number(trimmed);
      // Literal string ('...' or "...")
      if (/^'([^']*)'$/.test(trimmed) || /^"([^"]*)"$/.test(trimmed)) {
        return trimmed.slice(1, -1);
      }
      // Null
      if (/^NULL$/i.test(trimmed)) return null;

      // CASE WHEN ... THEN ... ELSE ... END
      if (/^CASE\b/i.test(trimmed) && /\bEND$/i.test(trimmed)) {
        const whens: Array<{ cond: string; res: string }> = [];
        const whenRegex = /WHEN\s+([\s\S]+?)\s+THEN\s+([\s\S]+?)(?=\s+WHEN|\s+ELSE|\s+END)/gi;
        let wm: RegExpExecArray | null;
        while ((wm = whenRegex.exec(trimmed)) !== null) {
          whens.push({ cond: wm[1].trim(), res: wm[2].trim() });
        }
        const elseMatch = trimmed.match(/ELSE\s+([\s\S]+?)\s+END$/i);
        const elseVal = elseMatch ? elseMatch[1].trim() : null;

        for (const w of whens) {
          if (evalCondition(w.cond, row)) {
            return evalExpr(w.res, row);
          }
        }
        return elseVal ? evalExpr(elseVal, row) : null;
      }

      // Column lookup
      const key = trimmed.toLowerCase();
      if (row && key in row) {
        return row[key];
      }

      // Arithmetic e.g. amount * quantity
      const mathMatch = trimmed.match(/^([a-z0-9_.]+)\s*([\+\-\*\/])\s*([a-z0-9_.]+)$/i);
      if (mathMatch && row) {
        const v1 = Number(evalExpr(mathMatch[1], row) || 0);
        const op = mathMatch[2];
        const v2 = Number(evalExpr(mathMatch[3], row) || 0);
        if (op === '+') return v1 + v2;
        if (op === '-') return v1 - v2;
        if (op === '*') return v1 * v2;
        if (op === '/') return v2 === 0 ? null : v1 / v2;
      }

      return row ? row[key] : trimmed;
    };

    // Helper: evaluate condition for a row (WHERE / HAVING)
    const evalCondition = (condStr: string, row?: GenericRow): boolean => {
      if (!condStr || !condStr.trim()) return true;

      // Split by OR
      const orParts = condStr.split(/\s+\bOR\b\s+/i);
      if (orParts.length > 1) {
        return orParts.some((part) => evalCondition(part, row));
      }

      // Split by AND
      const andParts = condStr.split(/\s+\bAND\b\s+/i);
      if (andParts.length > 1) {
        return andParts.every((part) => evalCondition(part, row));
      }

      const single = condStr.trim();

      // IS NOT NULL / IS NULL
      if (/\bIS\s+NOT\s+NULL$/i.test(single)) {
        const col = single.replace(/\s+IS\s+NOT\s+NULL$/i, '').trim();
        const v = evalExpr(col, row);
        return v !== null && v !== undefined;
      }
      if (/\bIS\s+NULL$/i.test(single)) {
        const col = single.replace(/\s+IS\s+NULL$/i, '').trim();
        const v = evalExpr(col, row);
        return v === null || v === undefined;
      }

      // LIKE
      const likeMatch = single.match(/^([\s\S]+?)\s+LIKE\s+['"]([\s\S]*?)['"]$/i);
      if (likeMatch) {
        const val = String(evalExpr(likeMatch[1], row) || '').toLowerCase();
        const pattern = likeMatch[2].toLowerCase().replace(/%/g, '.*').replace(/_/g, '.');
        const reg = new RegExp(`^${pattern}$`, 'i');
        return reg.test(val);
      }

      // IN (...)
      const inMatch = single.match(/^([\s\S]+?)\s+IN\s*\(([\s\S]+?)\)$/i);
      if (inMatch) {
        const val = evalExpr(inMatch[1], row);
        const candidates = inMatch[2].split(',').map((s) => evalExpr(s.trim(), row));
        return candidates.some((c) => String(c).toLowerCase() === String(val).toLowerCase());
      }

      // Comparisons: >=, <=, !=, <>, >, <, =
      const compMatch = single.match(/^([\s\S]+?)\s*(>=|<=|!=|<>|>|<|=)\s*([\s\S]+)$/);
      if (compMatch) {
        const left = evalExpr(compMatch[1], row);
        const op = compMatch[2];
        const right = evalExpr(compMatch[3], row);

        const leftNum = Number(left);
        const rightNum = Number(right);
        const areNumeric = !isNaN(leftNum) && !isNaN(rightNum) && typeof left !== 'boolean' && typeof right !== 'boolean';

        if (op === '=' || op === '==') {
          return areNumeric ? leftNum === rightNum : String(left).toLowerCase() === String(right).toLowerCase();
        }
        if (op === '!=' || op === '<>') {
          return areNumeric ? leftNum !== rightNum : String(left).toLowerCase() !== String(right).toLowerCase();
        }
        if (op === '>') return areNumeric ? leftNum > rightNum : String(left) > String(right);
        if (op === '>=') return areNumeric ? leftNum >= rightNum : String(left) >= String(right);
        if (op === '<') return areNumeric ? leftNum < rightNum : String(left) < String(right);
        if (op === '<=') return areNumeric ? leftNum <= rightNum : String(left) <= String(right);
      }

      return Boolean(evalExpr(single, row));
    };

    // 3. Apply WHERE
    if (clauses.where) {
      records = records.filter((row) => evalCondition(clauses.where, row));
    }

    // 4. Split SELECT columns
    const splitExpressions = (str: string): string[] => {
      const parts: string[] = [];
      let current = '';
      let parenDepth = 0;
      let inQuotes = false;
      let quoteChar = '';

      for (let i = 0; i < str.length; i++) {
        const ch = str[i];
        if (inQuotes) {
          current += ch;
          if (ch === quoteChar) inQuotes = false;
        } else if (ch === "'" || ch === '"') {
          inQuotes = true;
          quoteChar = ch;
          current += ch;
        } else if (ch === '(') {
          parenDepth++;
          current += ch;
        } else if (ch === ')') {
          parenDepth--;
          current += ch;
        } else if (ch === ',' && parenDepth === 0) {
          parts.push(current.trim());
          current = '';
        } else {
          current += ch;
        }
      }
      if (current.trim()) parts.push(current.trim());
      return parts;
    };

    const selectExprsRaw = splitExpressions(selectColsRaw);
    const selectDefs = selectExprsRaw.map((expr) => {
      let codeExpr = expr;
      let alias = expr;

      const asMatch = expr.match(/^([\s\S]+?)\s+AS\s+([a-z0-9_]+)$/i);
      if (asMatch) {
        codeExpr = asMatch[1].trim();
        alias = asMatch[2].trim();
      } else {
        const spaceMatch = expr.match(/^([\s\S]+?)\s+([a-z0-9_]+)$/i);
        if (spaceMatch && !/^(AND|OR|NOT|ASC|DESC|FROM|JOIN|WHEN|THEN|ELSE|END)$/i.test(spaceMatch[2])) {
          codeExpr = spaceMatch[1].trim();
          alias = spaceMatch[2].trim();
        }
      }

      const aggMatch = codeExpr.match(/^(COUNT|SUM|AVG|MIN|MAX|ROUND)\s*\(\s*([\s\S]*?)\s*\)$/i);
      return {
        raw: expr,
        codeExpr,
        alias,
        isAgg: Boolean(aggMatch),
        aggFunc: aggMatch ? aggMatch[1].toUpperCase() : null,
        aggArg: aggMatch ? aggMatch[2].trim() : null,
      };
    });

    const hasAnyAgg = selectDefs.some((d) => d.isAgg);

    // 5. Handle GROUP BY or Aggregations
    let finalRows: GenericRow[] = [];
    let finalColNames: string[] = [];

    if (clauses.groupBy || hasAnyAgg) {
      const groupCols = clauses.groupBy ? splitExpressions(clauses.groupBy).map((s) => s.toLowerCase().trim()) : [];

      const groups = new Map<string, GenericRow[]>();

      for (const row of records) {
        const groupKey = groupCols.map((c) => String(evalExpr(c, row))).join('|||');
        if (!groups.has(groupKey)) {
          groups.set(groupKey, []);
        }
        groups.get(groupKey)!.push(row);
      }

      if (groups.size === 0 && groupCols.length === 0) {
        groups.set('default', []);
      }

      const groupEntries = Array.from(groups.entries());
      for (let gIdx = 0; gIdx < groupEntries.length; gIdx++) {
        const groupRows = groupEntries[gIdx][1];
        const representative = groupRows[0] || {};
        const groupResultRow: GenericRow = {};

        for (const def of selectDefs) {
          if (def.isAgg) {
            let val: any;
            const arg = def.aggArg || '';

            if (def.aggFunc === 'COUNT') {
              if (arg === '*' || !arg) {
                val = groupRows.length;
              } else {
                val = groupRows.filter((r: GenericRow) => evalExpr(arg, r) !== null && evalExpr(arg, r) !== undefined).length;
              }
            } else if (def.aggFunc === 'SUM') {
              val = groupRows.reduce((acc: number, r: GenericRow) => acc + (Number(evalExpr(arg, r)) || 0), 0);
            } else if (def.aggFunc === 'AVG') {
              const sum = groupRows.reduce((acc: number, r: GenericRow) => acc + (Number(evalExpr(arg, r)) || 0), 0);
              val = groupRows.length > 0 ? sum / groupRows.length : 0;
              val = Math.round(val * 100) / 100;
            } else if (def.aggFunc === 'MIN') {
              const nums = groupRows.map((r: GenericRow) => evalExpr(arg, r)).filter((n: any) => n !== null && n !== undefined);
              val = nums.length > 0 ? Math.min(...nums) : null;
            } else if (def.aggFunc === 'MAX') {
              const nums = groupRows.map((r: GenericRow) => evalExpr(arg, r)).filter((n: any) => n !== null && n !== undefined);
              val = nums.length > 0 ? Math.max(...nums) : null;
            } else if (def.aggFunc === 'ROUND') {
              const roundParts = arg.split(',');
              const innerVal = Number(evalExpr(roundParts[0], representative) || 0);
              const dec = roundParts[1] ? Number(roundParts[1]) : 0;
              val = Number(innerVal.toFixed(dec));
            }
            groupResultRow[def.alias.toLowerCase()] = val;
            groupResultRow[def.codeExpr.toLowerCase()] = val;
          } else {
            groupResultRow[def.alias.toLowerCase()] = evalExpr(def.codeExpr, representative);
          }
        }

        if (clauses.having) {
          if (!evalCondition(clauses.having, groupResultRow)) {
            continue;
          }
        }

        finalRows.push(groupResultRow);
      }

      finalColNames = selectDefs.map((d) => d.alias);
    } else {
      if (selectColsRaw === '*') {
        const sample = records[0] || (MOCK_DATABASE_TABLES[mainTableName] as GenericRow[])[0] || {};
        finalColNames = Object.keys(sample).filter((k) => !k.includes('.'));
        finalRows = records.map((r) => {
          const rowObj: GenericRow = {};
          finalColNames.forEach((col) => {
            rowObj[col] = r[col];
          });
          return rowObj;
        });
      } else {
        finalColNames = selectDefs.map((d) => d.alias);
        finalRows = records.map((r) => {
          const rowObj: GenericRow = {};
          selectDefs.forEach((def) => {
            rowObj[def.alias.toLowerCase()] = evalExpr(def.codeExpr, r);
          });
          return rowObj;
        });
      }
    }

    // 6. Handle DISTINCT
    if (isDistinct) {
      const seen = new Set<string>();
      finalRows = finalRows.filter((r) => {
        const key = finalColNames.map((c) => String(r[c.toLowerCase()])).join('|||');
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      });
    }

    // 7. Handle ORDER BY
    if (clauses.orderBy) {
      const orderDirectives = splitExpressions(clauses.orderBy).map((directive) => {
        const parts = directive.trim().split(/\s+/);
        const col = parts[0].toLowerCase();
        const dir = parts[1] && parts[1].toUpperCase() === 'DESC' ? 'DESC' : 'ASC';
        return { col, dir };
      });

      finalRows.sort((a, b) => {
        for (const { col, dir } of orderDirectives) {
          const vA = a[col] !== undefined ? a[col] : evalExpr(col, a);
          const vB = b[col] !== undefined ? b[col] : evalExpr(col, b);

          if (vA === vB) continue;
          if (vA === null || vA === undefined) return 1;
          if (vB === null || vB === undefined) return -1;

          const numA = Number(vA);
          const numB = Number(vB);
          const areNum = !isNaN(numA) && !isNaN(numB) && typeof vA !== 'boolean' && typeof vB !== 'boolean';

          const cmp = areNum ? (numA < numB ? -1 : 1) : String(vA).localeCompare(String(vB));
          return dir === 'DESC' ? -cmp : cmp;
        }
        return 0;
      });
    }

    // 8. Handle LIMIT / OFFSET
    if (clauses.limit) {
      const limitParts = clauses.limit.trim().split(/\s+(?:OFFSET\s+)?/i);
      const limitCount = parseInt(limitParts[0], 10);
      const offsetCount = limitParts[1] ? parseInt(limitParts[1], 10) : 0;
      if (!isNaN(limitCount)) {
        finalRows = finalRows.slice(offsetCount, offsetCount + limitCount);
      }
    }

    // Map output to 2D array for table rendering
    const outputRows: string[][] = finalRows.map((r) => {
      return finalColNames.map((c) => {
        const val = r[c.toLowerCase()];
        if (val === null || val === undefined) return 'NULL';
        if (typeof val === 'number') {
          return Number.isInteger(val) ? String(val) : val.toFixed(2);
        }
        return String(val);
      });
    });

    const endTime = performance.now();
    return {
      columns: finalColNames,
      rows: outputRows,
      rowCount: outputRows.length,
      executionTimeMs: Math.max(1, Math.round(endTime - startTime)),
      error: null,
    };
  } catch (err: any) {
    const endTime = performance.now();
    return {
      columns: [],
      rows: [],
      rowCount: 0,
      executionTimeMs: Math.max(1, Math.round(endTime - startTime)),
      error: err.message || 'Syntax or evaluation error in SQL statement execution.',
    };
  }
};

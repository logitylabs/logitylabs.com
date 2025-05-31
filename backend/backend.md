# Backend API Design

### `/upload`

**Method**: `POST`  
**Payload**: `multipart/form-data`  
**Function**: Uploads the log file and stores it temporarily.

### `/analyze`

**Method**: `POST`  
**Payload**: JSON with filename  
**Function**: Detects file type → parses it → finds DTCs → matches faults.

---

## Log Types & Parsers

### DoIP Logs

- Format: `.log`
- Format: `[timestamp] IP -> IP | hex bytes`
- Output: List of payloads with IP context

### CAN Logs

- Format: `.csv`
- Columns: `timestamp, can_id, data`
- Output: Parsed into dictionaries with hex byte arrays

#### Vector Links

Check Vector out to get inspiration when it comes to CAN Logs:
CANalyzer: https://www.vector.com/int/en/products/products-a-z/software/canalyzer/diagnostics/#
CANoe: https://www.vector.com/int/en/products/products-a-z/software/canoe/diagnostics/#

### DLT Logs

- Format: `.txt`
- Format: `timestamp ECU LEVEL APP Context - Message`
- Output: Structured log entries with message parsing

---

## Fault Matcher

- **Source**: `dtc_db.yaml`
- **Structure**:

```yaml
C1234:
  description: "ABS sensor failure"
  likely_causes: [...]
  suggested_fix: "Replace sensor"
```

- Matched using regex across log messages or payloads

---

## AI Layer

### Phase 1: RAG (Retrieval-Augmented Generation)

- Use local Deepseek running on a Local Machine to not risk to go against any
- Build prompt dynamically from:
  - Parsed log snippet
  - DTC match
  - Fault DB explanation
- Query vector DB (ChromaDB) for context, feed into LLM
- Output natural language explanation or detailed reports. At the beginning the reports will be simple and after the Fine-Tuning the reports will be huge.

#### Cross-Check Capabilities (MCP Style)

The AI model will be equipped with a Multi-Context Processing (MCP) architecture, enabling it to:

- Utilize various tools autonomously
- Make intelligent decisions about tool selection
- Access multiple data sources seamlessly

#### Integrated Tools & APIs

The model will interface with various Volvo systems including (need to prio the most important once for the MVP):

- **Vehicle Systems**
  - Carweaver (Requirements & Specifications)
  - VIDA (Vehicle Information & Diagnostics)
  - CarCom (Diagnostic Commands Database)
- **Quality & Documentation**
  - VIRA (Issue Tracking)
  - ICAs (Interim Corrective Action)
  - QBay (Production Result UI)
  - C-Notes (Technical Notes for Releases to Plant)
- **Technical Resources**
  - Topology Maps
  - ATACQ (Difects Analysis)
  - Deviations Database

### Phase 2: Fine-Tuned LLM and MCP

#### Volvo-Specific Training Data

The model will be fine-tuned using:

- **Diagnostic Data**
  - CarCom entries
    - Diagnostic IDs (DIDs)
    - Diagnostic Trouble Codes (DTCs)
    - Control Routines
- **Service Information**
  - Internal VIRA ticket history
  - Root cause analysis documentation
  - Workshop repair feedback and solutions

### Phase 3: Real-Time Debugging Copilot

- Live assistant that:
  - Monitors logs in real-time
  - Flags anomalies
  - Answers questions like:
    - "What happened before the fault?"
    - "Which sensors showed drift?"

### Example Prompt:

```
Given the DTC C1234, log extract [sensor X dropped voltage for 3s below 5V], and context [ABS active], what's the likely root cause?
```

import { useState, useEffect } from "react";
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; 
import { useNavigate } from "react-router-dom"; 
import { getBabyLogs, editLog, deleteLog } from "../../services/logs_api"; 
import { getCurrentBaby } from "../../services/partner_api";
import { useModal } from "../../hooks/useModal";
import "../../styles/record_calendar.css"; 

function Record_Calendar() {
    const navigate = useNavigate();
    const [bId, setBId] = useState(null);
    const [logs, setLogs] = useState([]);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [markedDates, setMarkedDates] = useState(new Set());
    const [editingLogId, setEditingLogId] = useState(null);
    const [editContent, setEditContent] = useState("");  
    const { showAlert, showConfirm } = useModal(); 

    useEffect(() => {
        const init = async () => {
            const baby = await getCurrentBaby();
            if (baby) {
                setBId(baby.b_id);
                const allLogs = await getBabyLogs(baby.b_id);
                setLogs(allLogs);

                const dateStrings = allLogs.map(log => log.l_date.split("T")[0]);
                setMarkedDates(new Set(dateStrings));
            }
        };
        init();
    }, []);

    const formatDate = (date) => {
        const offset = date.getTimezoneOffset() * 60000;
        return new Date(date.getTime() - offset).toISOString().split("T")[0];
    };

    const tileContent = ({ date, view }) => {
        if (view === 'month') {
            const dateStr = formatDate(date);
            if (markedDates.has(dateStr)) {
                return <div className="marked-dot">●</div> 
            }
        }
        return null;
    };

    const handleDelete = async (l_id) => {
        const confirmed = await showConfirm("이 기록을 정말 삭제하시겠습니까?");
        if (!confirmed) return;
        try {
            await deleteLog(l_id);
            showAlert("삭제되었습니다.");
                
            setLogs(prevLogs => {
                const newLogs = prevLogs.filter(log => log.l_id !== l_id);
                const newDateStrings = newLogs.map(log => log.l_date.split("T")[0]);
                setMarkedDates(new Set(newDateStrings));
                return newLogs;
            });
        } catch (error) {
            console.error("삭제 실패:", error);
            showAlert("삭제에 실패했습니다.", "error");
        }
    };
    

    const handleEditClick = (log) => {
        setEditingLogId(log.l_id);
        setEditContent(log.l_content);  
    };

    const handleEditCancel = () => {
        setEditingLogId(null);
        setEditContent("");
    };

    const handleEditSave = async (l_id) => {
        if (!editContent.trim()) {
            showAlert("내용을 입력해주세요.", "error");
            return;
        }

        try {
            await editLog(l_id, { l_content: editContent });
            showAlert("수정되었습니다.");

            setLogs(prevLogs => prevLogs.map(log => 
                log.l_id === l_id ? { ...log, l_content: editContent } : log
            ));
            
            setEditingLogId(null);
            setEditContent("");
        } catch (error) {
            console.error("수정 실패:", error);
            showAlert("수정에 실패했습니다.", "error");
        }
    };

    const selectedDateStr = formatDate(selectedDate);
    const logsForSelectedDate = logs.filter(log => log.l_date.split("T")[0] === selectedDateStr);

    return (
        <div className="record-calendar-container">
            <div className="calendar-page-header">
                <button className="back-btn" onClick={() => navigate(-1)}>← 뒤로</button>
                <h2>기록 조회 📖</h2>
            </div>
            
            <div className="calendar-wrapper">
                <Calendar 
                    onChange={setSelectedDate}
                    value={selectedDate}
                    tileContent={tileContent}
                    formatDay={(locale, date) => date.getDate()} 
                    next2Label={null} 
                    prev2Label={null} 
                />
            </div>

            <div className="record-list-container">
                <h3 className="record-list-title">
                    {new Date(selectedDate).getMonth() + 1}월 {new Date(selectedDate).getDate()}일의 기록
                </h3>
                
                <div className="record-items-wrapper">
                    {logsForSelectedDate.length > 0 ? (
                        logsForSelectedDate.map(log => (
                            <div key={log.l_id} className="record-card">
                                {editingLogId === log.l_id ? (
                                    <div className="record-edit-mode">
                                        <textarea 
                                            className="record-edit-textarea"
                                            value={editContent} 
                                            onChange={(e) => setEditContent(e.target.value)} 
                                            rows="3"
                                            placeholder="수정할 내용을 입력해주세요"
                                        />
                                        <div className="edit-action-group">
                                            <button className="edit-action-btn edit-cancel-btn" onClick={handleEditCancel}>취소</button>
                                            <button className="edit-action-btn edit-submit-btn" onClick={() => handleEditSave(log.l_id)}>저장</button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <p>{log.l_content}</p>
                                        <div className="record-card-actions">
                                            <button className="record-action-btn edit-btn" onClick={() => handleEditClick(log)}>수정</button>
                                            <button className="record-action-btn delete-btn" onClick={() => handleDelete(log.l_id)}>삭제</button>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))
                    ) : (
                        <div className="empty-record">
                            <p>작성된 기록이 없습니다.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default Record_Calendar;